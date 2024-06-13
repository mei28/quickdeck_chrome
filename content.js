chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSlideShareEmbedUrl') {
    const embedUrl = extractEmbedUrl(document.documentElement.innerHTML);
    sendResponse({ embedUrl: embedUrl });
  }
});

function extractEmbedUrl(html) {
  const regex = /https:\/\/www\.slideshare\.net\/slideshow\/embed_code\/key\/\w+/;
  const match = html.match(regex);
  return match ? match[0] : null;
}
