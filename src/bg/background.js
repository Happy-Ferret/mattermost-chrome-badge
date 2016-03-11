
var chat = "http://192.168.47.60:8065";
var pingDuration = 2000;
var privateMessageBadge = "icons/icon96.png";
var closedTabBadge = "icons/iconred96.png";
var groupOrChannelBadge = "icons/iconblue36.png";


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
      chrome.tabs.create({url: chat});
  });
}
chrome.browserAction.onClicked.addListener(goToChat);


function checkMessages() {
  chrome.windows.getAll({populate: true}, function(windows) {
    var connected = false;
    var state;

    windows.forEach(function(a_window) {
      a_window.tabs.forEach(function(tab) {
        state = parseTabName(tab);
        connected = true;
      });
    });

    if (!connected) updateState();
    else updateState(state);
  });
}
setInterval(checkMessages, pingDuration);


function parseTabName(tab) {
  var groupMessage = false;
  var numberUnread = 0;

  if (tab.url.indexOf(chat) > -1) {
    if (tab.title.indexOf("*") > -1) {
      groupMessage = true;
    }
    if (tab.title.indexOf("(") > -1) {
      var rgx = /\(([^)]+)\)/;
      var matcher = tab.title.match(rgx);
      numberUnread = matcher && matcher[1];
    }
  }

  return {"groupMessage": groupMessage, "numberUnread": numberUnread};
}


function updateState(state) {
  var badge;
  var groupMessage = state["groupMessage"];
  var numberUnread = state["numberUnread"];

  // Set the badge icon.
  if (groupMessage)
    badge = groupOrChannelBadge;
  else if (groupMessage === undefined && numberUnread === undefined)
    badge = closedTabBadge;
  else
    badge = privateMessageBadge;

  chrome.browserAction.setIcon({path: badge});

  // Set the number of unread.
  var bubbleText = "";
  if (numberUnread > 0)
    bubbleText = "" + numberUnread;

  chrome.browserAction.setBadgeText({ text: bubbleText});
}
