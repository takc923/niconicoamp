
var menu = document.querySelector(".siteHeaderMenuList");
var registerButton = document.createElement('li');
var anchor = document.createElement('a');
var img = document.createElement('img');
img.src = chrome.extension.getURL("icon/add.png");
img.height = "17";
anchor.href = 'javascript:void(0);';
anchor.addEventListener('click', function(){
    chrome.runtime.sendMessage({
        action : "register"
    });
});
anchor.appendChild(img);
registerButton.appendChild(anchor);
menu.appendChild(registerButton);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        return window[request.action](request.args, sender, sendResponse);
    }
);

var player = document.getElementById('external_nicoplayer');

function toggle() {
    player.ext_play(player.ext_getStatus() !== "playing");
}
