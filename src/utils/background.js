chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getSession") {
        // console.log("event get Session");
        // console.log(request.sfHost);
        chrome.cookies.get(
            {
                url: request.sfHost,
                name: "sid" /*storeId: sender.tab.cookieStoreId*/,
            },
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
                // console.log("session " + JSON.stringify(session));
                sendResponse(session);
            },
        );
        return true; // Tell Chrome that we want to call sendResponse asynchronously.
    }
});
