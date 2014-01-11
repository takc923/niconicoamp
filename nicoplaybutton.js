// todo: 他のtabでregisterされた時の処理
var menu = document.querySelector(".siteHeaderMenuList");
var registerButton = document.createElement('li');
var anchor = document.createElement('a');
// add/subをregister/unregisterにしたほうがわかりやすい
var imgAdd = makeButton("icon/add.png", "inline");
var imgSub = makeButton("icon/sub.png", "none");
anchor.href = 'javascript:void(0);';
anchor.addEventListener('click', function(){
    if (isAlreadyRegistered()) {
        displayAddButton();
        unregister();
    } else {
        displaySubButton();
        register();
    }
    function displayAddButton() {
        imgAdd.style.display = 'inline';
        imgSub.style.display = 'none';
    }
    function displaySubButton() {
        imgAdd.style.display = 'none';
        imgSub.style.display = 'inline';
    }
    function isAlreadyRegistered() {
        return imgSub.style.display == 'inline';
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

function makeButton(path, display) {
    var img = document.createElement('img');
    img.src = chrome.extension.getURL(path);
    img.height = "17";
    img.style.display = display;
    return img;
}

function register() {
    chrome.runtime.sendMessage({
        action : "register"
    });
}
function unregister() {
    chrome.runtime.sendMessage({
        action : "unregister"
    });
}

//for onMessage callback functions
function toggle(args, sender, sendResponse) {
    var isPlaying = player.ext_getStatus() == "playing";
    player.ext_play(! isPlaying);
    sendResponse(isPlaying);
}
