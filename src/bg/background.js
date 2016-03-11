var chat = "192.168.47.60";
 function doStuff() {
	checkMessages()
	setTimeout(doStuff, 2000);
}
setTimeout(doStuff, 2000);

function checkMessages(){
var found = false;
chrome.tabs.getAllInWindow(null, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
	if(tabs[i].url.indexOf(chat) > -1 && tabs[i].title.startsWith("(")){
		found=true;
		var title = tabs[i].title;
		chrome.browserAction.setBadgeText({text: title});
		var rgx = /\(([^)]+)\)/;
		var matcher = title.match(rgx);
		var notif = matcher && matcher[1];
		chrome.browserAction.setBadgeText({text: notif});
	}
    }

    if(!found)
	chrome.browserAction.setBadgeText({text: ""});
});

}
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
//  	chrome.pageAction.show(sender.tab.id);
//    sendResponse();
chrome.browserAction.setBadgeText({text: "10+"});
alert("hello");
  });
