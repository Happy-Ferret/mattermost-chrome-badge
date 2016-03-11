var chat = "http://192.168.47.60:8065";
var pingDuration = 2000;
var privateMessageBadge = "icons/icon16.png";
var closedTabBadge = "icons/iconred16.png";
var groupOrChannelBadge = "icons/iconblue36.png";

chrome.browserAction.onClicked.addListener(function(icon) {
  goToChat();
});

function goToChat() {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    var found = false;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].url.indexOf(chat) > -1) {
	found = true;
    	chrome.tabs.update(tabs[i].id, {selected: true});
      }
    }
    if(!found)
	chrome.tabs.create({
    url: chat
  });
  });
}

function ping() {
  checkMessages()
  setTimeout(ping, pingDuration);
}
setTimeout(ping, pingDuration);

function checkMessages() {
 chrome.browserAction.setBadgeText({
            text: ""
          });
  var tabFound = false;
  chrome.windows.getAll({populate:true}, function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){


        if (tab.url.indexOf(chat) > -1) {
          tabFound = true;
          chrome.browserAction.setIcon({
            path: privateMessageBadge
          });
          var title = tab.title;
          if (title.indexOf("*") > -1) {
            chrome.browserAction.setIcon({
              path: groupOrChannelBadge
            });
            chrome.browserAction.setBadgeText({
              text: ""
            });
          }
          if (title.indexOf("(") > -1) {
            chrome.browserAction.setBadgeText({
              text: title
            });
            var rgx = /\(([^)]+)\)/;
            var matcher = title.match(rgx);
            var privateMsgCount = matcher && matcher[1];
            chrome.browserAction.setBadgeText({
              text: privateMsgCount
            });
          }
        }




      });
    });
  });
}
