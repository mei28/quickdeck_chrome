document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const url = currentTab.url;
      if (isValidUrl(url)) {
        document.getElementById('url').value = url;
      }
    }
  });

  document.getElementById('open').addEventListener('click', function() {
    const url = document.getElementById('url').value;

    if (!isValidUrl(url)) {
      showAlert('Please enter a valid SlideShare URL.');
      return;
    }

    showLoading(true);
    chrome.runtime.sendMessage({ action: 'openUrl', url: url }, () => {
      showLoading(false);
      window.close();
    });
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

function showLoading(show) {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = show ? 'block' : 'none';
}

function showAlert(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

