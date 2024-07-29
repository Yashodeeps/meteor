let timerInterval;
let timerStart = 0;
let isRunning = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timerStart: 0, isRunning: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_TIMER") {
    if (!isRunning) {
      isRunning = true;
      timerStart = Date.now() - (message.elapsedTime || 0);
      timerInterval = setInterval(() => {
        chrome.storage.local.set({ timerStart });
      }, 1000);
    }
  } else if (message.action === "STOP_TIMER") {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      chrome.storage.local.set({ isRunning: false });
    }
  } else if (message.action === "RESET_TIMER") {
    clearInterval(timerInterval);
    isRunning = false;
    timerStart = Date.now();
    chrome.storage.local.set({ timerStart, isRunning });
  }
});
