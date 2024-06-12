document.getElementById('open').addEventListener('click', function() {
  const url = document.getElementById('url').value;
  chrome.runtime.sendMessage({ action: 'openUrl', url: url });
});
