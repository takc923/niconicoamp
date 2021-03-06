var registeredTabId;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

chrome.browserAction.onClicked.addListener(toggle);
chrome.commands.onCommand.addListener(toggle);

chrome.tabs.onRemoved.addListener(function(removedTabId, removeInfo) {
    if (removedTabId === registeredTabId) unregister();
});

chrome.tabs.onUpdated.addListener(function(updatedTabId, changeInfo) {
    if (changeInfo.status == 'loading'
        && updatedTabId === registeredTabId
        && changeInfo.url.search(/^http:\/\/www.nicovideo.jp\/watch\//) == -1){
        unregister();
    }
});

function toggle() {
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
}

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
