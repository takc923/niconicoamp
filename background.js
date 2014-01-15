var registeredTabId;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

chrome.browserAction.onClicked.addListener(function(){
    if (! registeredTabId) return;

    chrome.tabs.sendMessage(
        registeredTabId,
        { action: "toggle" },
        function(isPlaying) {
            if(chrome.runtime.lastError) {
                chrome.browserAction.setIcon({path: "icon/icon.png"});
            }else if(isPlaying) {
                chrome.browserAction.setIcon({path: "icon/play_black.png"});
            } else {
                chrome.browserAction.setIcon({path: "icon/pause.png"});
            }
        }
    );
});

// 何故か空タブじゃないと発動しない
// Chromeのバグだった: https://code.google.com/p/chromium/issues/detail?id=248998
chrome.tabs.onRemoved.addListener(function(removedTabId, removeInfo) {
    if (removedTabId === registeredTabId) unregister();
});
// 仕方がないから自前でタブが消えてないかチェックする
// 上記バグが修正されたら消す
setInterval(function() {
    if (! registeredTabId) return;

    chrome.tabs.get(registeredTabId, function(tab) {
        if (tab === undefined) unregister();
    });
}, 5000);

chrome.tabs.onUpdated.addListener(function(updatedTabId, changeInfo) {
    if (changeInfo.status == 'loading'
        && updatedTabId === registeredTabId
        && changeInfo.url.search(/^http:\/\/www.nicovideo.jp\/watch\//) == -1){
        unregister();
    }
});

// for onMessage callback functions
function register(args, sender){
    if (registeredTabId) {
        chrome.tabs.sendMessage(
            registeredTabId,
            { action: "displayRegisterButton" }
        );
    }
    registeredTabId = sender.tab.id;
    var iconPath = args.isPlaying ? "icon/pause.png" : "icon/play_black.png";
    chrome.browserAction.setIcon({path: iconPath});
    chrome.browserAction.setTitle({title: sender.tab.title.replace(/ - ニコニコ動画:.*$/, '')});
}
function unregister(dummy, sender){
    registeredTabId = null;
    chrome.browserAction.setIcon({path: "icon/icon.png"});
    chrome.browserAction.setTitle({title: "niconicoamp"});
}
