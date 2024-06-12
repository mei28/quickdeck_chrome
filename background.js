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
      alert('Please enter a valid SlideShare URL.');
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    processUrl(request.url);
    return true;
  }
});

function processUrl(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.text();
    })
    .then(html => {
      const embedUrl = extractEmbedUrl(html);
      if (embedUrl) {
        chrome.tabs.create({ url: embedUrl });
      } else {
        console.error('No embed URL found in the provided SlideShare page.');
        alert('No embed URL found in the provided SlideShare page.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to fetch URL or extract embed URL: ' + error.message);
    });
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

