"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getSession") {
        chrome.cookies.get(
            { url: request.sfHost, name: "sid" /*, storeId: sender.tab.cookieStoreId*/ },
            (sessionCookie) => {
                if (!sessionCookie) {
                    sendResponse(null);
                    return;
                }
                let session = {
                    orgId: sessionCookie.value.split("!")[0],
                    key: sessionCookie.value,
                    hostname: sessionCookie.domain,
                };
                sendResponse(session);
            },
        );
        return true; // Tell Chrome that we want to call sendResponse asynchronously.
    }
    return false;
});
