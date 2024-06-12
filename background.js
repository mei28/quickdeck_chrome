chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl') {
    fetch(request.url)
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
          alert('No embed URL found in the provided SlideShare page.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch URL or extract embed URL.');
      });
  }
  return true;
});

function extractEmbedUrl(html) {
  const regex = /https:\/\/www\.slideshare\.net\/slideshow\/embed_code\/key\/\w+/;
  const match = html.match(regex);
  return match ? match[0] : null;
}

