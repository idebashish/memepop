// Function to get the stored memes array
function getStoredMemes(callback) {
  chrome.storage.local.get({ shownMemes: [] }, (items) => {
    callback(items.shownMemes);
  });
}

// Function to add a meme ID to the storage
function addMemeToStorage(memeId, callback) {
  getStoredMemes((shownMemes) => {
    shownMemes.push(memeId);
    chrome.storage.local.set({ shownMemes }, () => {
      if (callback) callback();
    });
  });
}

// Function to check if a meme has been shown
function hasMemeBeenShown(memeId, callback) {
  getStoredMemes((shownMemes) => {
    const memeShown = shownMemes.includes(memeId);
    callback(memeShown);
  });
}

// Function to set the refresh interval
function setRefreshInterval(interval, callback) {
  chrome.storage.sync.set({ refreshInterval: interval }, () => {
    if (callback) callback();
  });
}

// Function to get the refresh interval
function getRefreshInterval(callback) {
  chrome.storage.sync.get({ refreshInterval: 10 }, (items) => {
    callback(items.refreshInterval);
  });
}

// Exporting the functions for use in other scripts
export { getStoredMemes, addMemeToStorage, hasMemeBeenShown, setRefreshInterval, getRefreshInterval };
