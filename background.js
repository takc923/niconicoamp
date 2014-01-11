var tabId;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

chrome.browserAction.onClicked.addListener(function(){
    if (! tabId) return;

    // todo: tabidがなかった場合の処理
    chrome.tabs.sendMessage(
        tabId,
        { action: "toggle" },
        function(isPlaying) {
            if(isPlaying) {
                chrome.browserAction.setIcon({path: "icon/play_black.png"});
            } else {
                chrome.browserAction.setIcon({path: "icon/pause.png"});
            }
        }
    );
});

// for onMessage callback functions
function register(args, sender){
    if (tabId) {
        chrome.tabs.sendMessage(
            tabId,
            { action: "displayAddButton" }
        );
    }
    tabId = sender.tab.id;
    var iconPath = args.isPlaying ? "icon/pause.png" : "icon/play_black.png";
    chrome.browserAction.setIcon({path: iconPath});
}
function unregister(dummy, sender){
    tabId = null;
    chrome.browserAction.setIcon({path: "icon/play_grey.png"});
}
