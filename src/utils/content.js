chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "Is User Logged In?") {
        sendResponse({ response: isUserLoggedIn() });
    }
    if (request.message === "logoutURL") {
        const logoutUrl = request.logoutUrl;
        const loginURL = request.loginUrl;
        // send message to background script to logout
        chrome.runtime.sendMessage({ message: "login", loginURL });
        sendResponse({ response: "OK" });
        window.location.href = logoutUrl;
    }
});

chrome.runtime.sendMessage({ message: "getLoginURL" }, function (response) {
    if (response && !isUserLoggedIn()) {
        setTimeout(() => {
            chrome.storage.local.remove("kee", function () {
                if (chrome.runtime.lastError) {
                    console.error("Error removing data: " + chrome.runtime.lastError.message);
                } else {
                    console.log("Data removed successfully");
                }
            });
            window.location.href = response;
        }, "1000");
    }
});

const isUserLoggedIn = () => {
    const lightningIcon = document.querySelector('lightning-icon[icon-name="utility:user"]');
    return lightningIcon !== null;
};
