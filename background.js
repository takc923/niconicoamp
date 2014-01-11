// todo: play/stop時のアイコン
var tabId;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

chrome.browserAction.onClicked.addListener(function(){
    if (! tabId) return;

    // todo: tabidがなかった場合の処理
    chrome.tabs.sendMessage(tabId, {
        action    : "toggle"
    });
});

function register(dummy, sender){
    tabId = sender.tab.id;
    chrome.browserAction.setIcon({path: "icon/play_black.png"});
}
function unregister(dummy, sender){
    tabId = null;
    chrome.browserAction.setIcon({path: "icon/play_grey.png"});
}
