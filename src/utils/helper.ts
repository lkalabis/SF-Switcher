import { JsonStructure } from "../types/JsonStructure";
import { OrgInfo } from "../types/OrgInfo";
import { User } from "../types/User";
import { PRODUCTION_URL, SANDBOX, SANDBOX_URL, STORAGE_KEY } from "./constants";
export const addOrgId = function (
    orgIds: { sessionId: string; url: URL; lastModified: Date; users: never[] }[],
    orgId: number,
    sessionId: string,
    url: URL,
    lastModified: Date,
) {
    orgIds[orgId] = {
        sessionId,
        url,
        lastModified,
        users: [],
    };
};

const handleStorageResult = (error: chrome.runtime.LastError | undefined, message: string, data: User) => {
    if (error) {
        console.error("Error:", error);
    }
};

export const getCurrentTabUrl = () => {
    return new Promise<string>((resolve, reject) => {
        // Get the current tab URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTabUrl = tabs[0]?.url;
            if (currentTabUrl) {
                resolve(currentTabUrl);
            } else {
                reject(new Error("Unable to get current tab URL."));
            }
        });
    });
};

export const getModifiedUrl = (url: string) => {
    const index = url.indexOf(".");
    let modifiedUrl = "";
    if (url.includes("trailblaze")) {
        modifiedUrl = url.slice(0, index) + ".trailblaze" + PRODUCTION_URL;
    } else {
        modifiedUrl = url.slice(0, index) + (url.includes(SANDBOX) ? SANDBOX_URL : PRODUCTION_URL);
    }
    return modifiedUrl;
};

/** Create a new UUID */
export const createUUID = () => {
    // @ts-ignore
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        // @ts-ignore
        const r = (Math.random() * 16) | 0;
        // @ts-ignore
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const writeNewEntryToStorage = (newEntry: User, currentOrg: OrgInfo) => {
    return new Promise<void>((resolve, reject) => {
        const orgId = currentOrg.orgId;

        chrome.storage.local.get(STORAGE_KEY, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
                return;
            }

            const storageData = result[STORAGE_KEY] || {};
            const existingData = new JsonStructure();
            existingData.orgIds = storageData;

            const userData: User = {
                Id: newEntry.Id,
                Username: newEntry.Username,
                Email: newEntry.Email,
                OrgId: orgId,
                Label: newEntry.Label,
                FirstName: newEntry.FirstName,
                LastName: newEntry.LastName,
                Shortcut: null,
                IsActive: true,
                UUID: newEntry.UUID,
                Profile: {
                    Name: newEntry.Profile.Name,
                },
            };

            if (!storageData[orgId]) {
                // 'orgId' not found, create a basic structure
                const initialData = new JsonStructure();

                // Add initial organization data
                initialData.addOrgId(orgId, currentOrg.key, currentOrg.hostname, new Date().toISOString());
                initialData.addUser(orgId, userData);

                chrome.storage.local.set(
                    {
                        [STORAGE_KEY]: {
                            ...storageData,
                            [orgId]: initialData.orgIds[orgId],
                        },
                    },
                    () => {
                        // @ts-ignore
                        handleStorageResult(chrome.runtime.lastError, "Initial data stored:", initialData.orgIds);
                        resolve();
                    },
                );
            } else {
                existingData.addUser(orgId, userData);
                chrome.storage.local.set({ [STORAGE_KEY]: existingData.orgIds }, () => {
                    handleStorageResult(chrome.runtime.lastError, "User added:", userData);
                    resolve();
                });
            }
        });
    });
};
