const createTimerElement = () => {
  const timerElement = document.createElement("div");
  timerElement.id = "chrome-timer";
  timerElement.style.position = "fixed";
  timerElement.style.bottom = "10px";
  timerElement.style.right = "10px";
  timerElement.style.padding = "10px";
  timerElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  timerElement.style.color = "#fff";
  timerElement.style.borderRadius = "5px";
  timerElement.style.zIndex = 1000;
  timerElement.style.fontSize = "16px";
  timerElement.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(timerElement);
  return timerElement;
};

const updateTimerDisplay = (timerElement, elapsedTime) => {
  const seconds = Math.floor(elapsedTime / 1000) % 60;
  const minutes = Math.floor(elapsedTime / 60000);
  timerElement.textContent = `${minutes}m ${seconds}s`;
};

const initTimer = () => {
  const timerElement = createTimerElement();

  chrome.storage.local.get(["timerStart", "isRunning"], (result) => {
    const { timerStart, isRunning } = result;
    const currentTime = Date.now();
    const elapsedTime = isRunning ? currentTime - timerStart : 0;

    updateTimerDisplay(timerElement, elapsedTime);

    if (isRunning) {
      setInterval(() => {
        const newElapsedTime = Date.now() - timerStart;
        updateTimerDisplay(timerElement, newElapsedTime);
      }, 1000);
    }
  });
};

initTimer();
