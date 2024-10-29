chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "processText",
    title: "TTS me this, Brian!",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "processText" && info.selectionText) {
    console.log("Selected text:", info.selectionText);

    if (info.selectionText.trim() === '') {
      return;
    }

    try {
      // Inject the content script, then call `fetchBrian`
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["content.js"]
        },
        () => fetchBrian(info.selectionText, tab.id)
      );
    } catch (err) {
      console.error("Error fetching audio:", err);
    }
  }
});

async function fetchBrian(text, tabId) {
  try {
    let response = await fetch(
      'https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=' + encodeURIComponent(text.trim())
    );

    if (response.status !== 200) {
      alert(await response.text());
      return;
    }

    let mp3Blob = await response.blob();
    let reader = new FileReader();
    reader.onloadend = () => {
      let base64Audio = reader.result.split(',')[1];
      chrome.tabs.sendMessage(tabId, { type: "playAudio", audioData: base64Audio });
    };
    reader.readAsDataURL(mp3Blob);
  } catch (err) {
    console.error("Failed to play sound:", err);
  }
}