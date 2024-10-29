chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "playAudio" && message.url) {
      let audio = new Audio(message.url);
      audio.play().catch(err => console.error("Audio playback error:", err));
    }
  });