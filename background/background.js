// Constants and Initial Setup
const MEME_SUBREDDITS = ["memes", "funny", "dankmemes"];
const MEME_FETCH_COUNT = 10;
let shownMemes = [];
let fetchAttemptCount = 0;
const MAX_FETCH_ATTEMPTS = 3;

// Setting up an alarm for fetching memes
chrome.alarms.create("fetchMeme", { periodInMinutes: 10 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchMeme") {
    fetchMeme();
  }
});


// Function to fetch a meme from Reddit
function fetchMeme() {
  const subreddit = MEME_SUBREDDITS[Math.floor(Math.random() * MEME_SUBREDDITS.length)];
  const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=${MEME_FETCH_COUNT}&t=day`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const posts = data.data.children;
      let memeFound = false;

      for (const post of posts) {
        if (!shownMemes.includes(post.data.id) && post.data.post_hint === 'image') {
          memeFound = true;
          shownMemes.push(post.data.id);
          sendMemeToPopup(post.data);
          break;
        }
      }

      // Handle cases where no new meme is found
      if (!memeFound) {
        fetchAttemptCount++;
        if (fetchAttemptCount <= MAX_FETCH_ATTEMPTS) {
          fetchMeme();
        } else {
          fetchAttemptCount = 0;
          handleNoNewMemeFound();
        }
      } else {
        fetchAttemptCount = 0;
      }

      // Clean up shownMemes list
      if (shownMemes.length > 100) {
        shownMemes = shownMemes.slice(-50);
      }
    })
    .catch(error => {
      console.error('Error fetching meme:', error);
      // Error handling logic here
    });
}



// Function to send meme data to the popup script
function sendMemeToPopup(memeData) {
  chrome.runtime.sendMessage({ type: 'newMeme', data: memeData });
}

// Function to handle cases where no new meme is found
function handleNoNewMemeFound() {
  chrome.runtime.sendMessage({ type: 'noMemeFound' });
}

// Listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pause") {
    chrome.alarms.clear("fetchMeme");
  } else if (request.action === "resume") {
    chrome.alarms.create("fetchMeme", { periodInMinutes: 10 });
  } else if (request.action === "next") {
    fetchMeme();
  }
});

// Initial fetch when the extension is installed or reloaded
fetchMeme();

