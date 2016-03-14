// Saves options to chrome.storage.local.
function save_options() {
  var chat_url = document.getElementById('chat_url').value;
  chrome.storage.local.set({chat_url: chat_url}, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    chrome.extension.getBackgroundPage().window.location.reload()
  });
}

// Restores text box state using the value stored in chrome.storage.local.
function restore_options() {
  chrome.storage.local.get({chat_url: 'http://'}, function(items) {
    document.getElementById('chat_url').value = items.chat_url;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
