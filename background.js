var tabId;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

chrome.browserAction.onClicked.addListener(function(){
    if (! tabId) return;

    chrome.tabs.sendMessage(
        tabId,
        { action: "toggle" },
        function(isPlaying) {
            if(chrome.runtime.lastError) {
                chrome.browserAction.setIcon({path: "icon/play_grey.png"});
            }else if(isPlaying) {
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
