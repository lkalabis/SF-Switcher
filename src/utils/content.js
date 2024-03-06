import { LOGOUT_URL } from "./constants";
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

// Add a click event listener to the document
document.addEventListener("click", function (event) {
    // Check if the clicked element is an anchor tag (a link)
    if (event.target.tagName === "A") {
        // Get the href attribute of the clicked link
        const clickedLink = event.target.getAttribute("href");

        if (clickedLink.includes(LOGOUT_URL)) {
            // Do something when the specific link is clicked
            chrome.storage.local.remove("kee", function () {
                if (chrome.runtime.lastError) {
                    console.error("Error removing data: " + chrome.runtime.lastError.message);
                } else {
                    console.log("Data removed successfully");
                }
            });
        }
    }
});
