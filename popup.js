document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;

    if (isValidUrl(url)) {
      document.getElementById('url').value = url;
      chrome.runtime.sendMessage({ action: 'openUrl', url: url });
      window.close();
    }
  });

  document.getElementById('open').addEventListener('click', function() {
    const url = document.getElementById('url').value;

    if (!isValidUrl(url)) {
      alert('Please enter a valid SlideShare URL.');
      return;
    }

    chrome.runtime.sendMessage({ action: 'openUrl', url: url });
  });
});

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('slideshare.net');
  } catch {
    return false;
  }
}

