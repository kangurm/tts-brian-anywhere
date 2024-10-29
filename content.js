chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "playAudio" && message.audioData) {
      // Convert the Base64 audio data to a blob and play it
      let audioBlob = new Blob([Uint8Array.from(atob(message.audioData), c => c.charCodeAt(0))], { type: 'audio/mp3' });
      let audioUrl = URL.createObjectURL(audioBlob);

      let audio = new Audio(audioUrl);
      audio.play().catch(err => console.error("Audio playback error:", err));
    }
  });