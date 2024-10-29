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

    fetchBrian(info.selectionText, tab.id);
  }
});

async function fetchBrian(text, tabId) {
  let response = await fetch('https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=' + encodeURIComponent(text.trim()));

  if (response.status !== 200) {
    alert(await response.text());
    return;
  }

  let mp3 = await response.blob();
  let blobUrl = URL.createObjectURL(mp3);

  // Send a message to the content script with the blob URL
  chrome.tabs.sendMessage(tabId, { type: "playAudio", url: blobUrl });
}