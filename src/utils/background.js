"use strict";
import { JsonStructure } from "../types/JsonStructure";
import { STORAGE_KEY } from "./constants";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const kee = "kee";
    if (request.message === "getLoginURL") {
        chrome.storage.local.get(`sf-user-switcher-${kee}`, (result) => {
            console.log("Value currently is " + result[`sf-user-switcher-${kee}`]);
            sendResponse(result[`sf-user-switcher-${kee}`]);
        });
        return true;
    }
    if (request.message === "login") {
        chrome.cookies.get(
            { url: request.sfHost, name: "sid" }, (cookie) => {

                if (cookie) {
                    let session = {
                        orgId: sessionCookie.value.split("!")[0],
                        key: sessionCookie.value,
                        hostname: sessionCookie.domain,
                    };

                    const key = `sf-user-switcher-${kee}`;
        const data = {};
        data[key] = request.loginURL;

        chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
                console.error("Error storing data: " + chrome.runtime.lastError.message);
            }
        });
                }
        );
        
    }
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

chrome.runtime.onInstalled.addListener(async () => {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    if (Object.keys(result).length === 0) {
        const jsonStructure = new JsonStructure();
        jsonStructure.settings = {
            ShowTooltip: true,
            ShowProfileNameInLabel: true,
            ShowAddFormAtTop: true,
            UseReLoginFeature: true,
            MillisecondsToWaitTillRelogin: 1000,
        };

        chrome.storage.local.set({ STORAGE_KEY: jsonStructure });
    }
});
