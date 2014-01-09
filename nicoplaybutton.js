
var menu = document.querySelector(".siteHeaderMenuList");
var registerButton = document.createElement('li');
var anchor = document.createElement('a');
var imgAdd = makeButton("icon/add.png", "inline");
var imgSub = makeButton("icon/sub.png", "none");
anchor.href = 'javascript:void(0);';
anchor.addEventListener('click', function(){
    chrome.runtime.sendMessage({
        action : "register"
    });
    toggleDisplay();

    function toggleDisplay() {
        var tmp = imgAdd.style.display;
        imgAdd.style.display = imgSub.style.display;
        imgSub.style.display = tmp;
    }
});
anchor.appendChild(imgAdd);
anchor.appendChild(imgSub);
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

function makeButton(path, display) {
    var img = document.createElement('img');
    img.src = chrome.extension.getURL(path);
    img.height = "17";
    img.style.display = display;
    return img;
}
