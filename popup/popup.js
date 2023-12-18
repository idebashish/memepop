document.addEventListener('DOMContentLoaded', function() {
  const memeImage = document.getElementById('meme-image');
  const prevButton = document.getElementById('prev-button');
  const pauseButton = document.getElementById('pause-button');
  const nextButton = document.getElementById('next-button');
  const redditUrlInput = document.getElementById('reddit-url');
  const copyUrlButton = document.getElementById('copy-url-button');
  const frequencyInput = document.getElementById('frequency-input');

  // Function to update the meme display
  function updateMemeDisplay(memeData) {
    memeImage.src = memeData.url;
    redditUrlInput.value = `https://reddit.com${memeData.permalink}`;
  }

  // Event listener for the 'Copy URL' button
  copyUrlButton.addEventListener('click', function() {
    redditUrlInput.select();
    document.execCommand('copy');
  });

  // Messaging with the background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'newMeme') {
      updateMemeDisplay(message.data);
    }
  });

  // Send message to background script to update frequency
  frequencyInput.addEventListener('change', function() {
    chrome.runtime.sendMessage({
      type: 'updateFrequency',
      frequency: Number(frequencyInput.value)
    });
  });

  // Navigation button event listeners
  prevButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({ type: 'navigate', direction: 'prev' });
  });

  pauseButton.addEventListener('click', function() {
    const isPaused = pauseButton.textContent === 'Pause';
    chrome.runtime.sendMessage({ type: 'pause', pause: isPaused });
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
  });

  nextButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({ type: 'navigate', direction: 'next' });
  });

  // Request the current meme on popup load
  chrome.runtime.sendMessage({ type: 'requestCurrentMeme' });
});
