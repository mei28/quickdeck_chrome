chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSlideShareUrl",
    title: "Open SlideShare",
    contexts: ["page", "selection", "link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSlideShareUrl") {
    if (tab && tab.url && isValidUrl(tab.url)) {
      processUrl(tab.url);
    } else {
      console.log("Not a valid SlideShare URL or no URL found.");
      if (tab.id) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("The URL is not a valid SlideShare URL.")
        });
      }
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    processUrl(request.url).then(() => {
      sendResponse({ status: 'completed' });
    }).catch(error => {
      sendResponse({ status: 'failed', message: error.message });
    });
    return true;
  }
});

async function processUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  const html = await response.text();
  const embedUrl = extractEmbedUrl(html);
  if (embedUrl) {
    chrome.tabs.create({ url: embedUrl });
  } else {
    throw new Error('No embed URL found in the provided SlideShare page.');
  }
}

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('slideshare.net');
  } catch {
    return false;
  }
}

function extractEmbedUrl(html) {
  const regex = /https:\/\/www\.slideshare\.net\/slideshow\/embed_code\/key\/\w+/;
  const match = html.match(regex);
  return match ? match[0] : null;
}

