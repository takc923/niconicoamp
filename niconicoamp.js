var menu = document.querySelector(".siteHeaderMenuList");
var registerButton = document.createElement('li');
var anchor = document.createElement('a');
var imgRegister = makeButton("icon/register.png", "inline");
var imgUnregister = makeButton("icon/unregister.png", "none");
anchor.href = 'javascript:void(0);';
anchor.addEventListener('click', function(){
    if (isAlreadyRegistered()) {
        displayRegisterButton();
        unregister();
    } else {
        displayUnregisterButton();
        register();
    }
});

anchor.appendChild(imgRegister);
anchor.appendChild(imgUnregister);
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
    img.style.display = display;
    return img;
}

function register() {
    chrome.runtime.sendMessage({
        action : "register",
        args: { isPlaying: player.ext_getStatus() == "playing"}
    });
}
function unregister() {
    chrome.runtime.sendMessage({
        action : "unregister"
    });
}

function displayRegisterButton() {
    imgRegister.style.display = 'inline';
    imgUnregister.style.display = 'none';
}
function displayUnregisterButton() {
    imgRegister.style.display = 'none';
    imgUnregister.style.display = 'inline';
}
function isAlreadyRegistered() {
    return imgUnregister.style.display == 'inline';
}

//for onMessage callback functions
function toggle(args, sender, sendResponse) {
    var isPlaying = player.ext_getStatus() == "playing";
    player.ext_play(! isPlaying);
    sendResponse(isPlaying);
}
