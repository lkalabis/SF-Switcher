import React, { useState } from "react";
import { getCurrentTabUrl, getModifiedUrl } from "../utils/helper";
import { User } from "../types/User";
import { LOGOUT_URL, STORAGE_KEY } from "../utils/constants";
import { SettingsType } from "../types/SettingsType";

import { useSortable } from "@dnd-kit/sortable";

function Entry({
    settings,
    entry,
    onDelete,
    onEdit,
}: {
    settings: SettingsType;
    entry: User;
    onDelete: (entry: User, withConfirmation: boolean) => void;
    onEdit: (entry: User) => void;
}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: entry.Id });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            cursor: 'grab', // Change cursor to hand
        }
        : { cursor: 'pointer' }; // Change cursor to hand if there's no transformation, adjust as needed

    const handleDelete = () => {
        onDelete(entry, true);
    };
    const handleEdit = () => {
        onEdit(entry);
    };

    const openInNewTab = async () => {
        const currentURL = await getCurrentTabUrl();
        const modifiedUrl = getModifiedUrl(currentURL);
        const target = encodeURIComponent(currentURL.split(".com")[1]);
        const properties = {
            active: true,
            url: `${modifiedUrl}/servlet/servlet.su?oid=${entry.OrgId}&suorgadminid=${entry.Id}&targetURL=${target}&retURL=${target}`,
        };

        if (settings?.UseReLoginFeature === false || settings?.UseReLoginFeature === undefined) {
            chrome.tabs.create(properties);
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // Query active tab
                const activeTab = tabs[0];

                // Send a message to the content script
                // @ts-ignore
                chrome.tabs.sendMessage(activeTab.id, { message: "Is User Logged In?" }, (response) => {
                    const isUserLoggedIn = response.isLoggedIn;
                    if (isUserLoggedIn) {
                        // logout current user
                        const logoutUrl = `${modifiedUrl}/${LOGOUT_URL}`;
                        // @ts-ignore
                        chrome.tabs.sendMessage(activeTab.id, { message: "logoutUser", logoutUrl }, (response) => {
                            if (response.response === "OK") {
                                chrome.storage.local.get(STORAGE_KEY, (result) => {
                                    const res = result[STORAGE_KEY];
                                    if (!res.loginURLs) {
                                        res.loginURLs = [];
                                    }
                                    // Check if properties.url is already in res.loginURLs array
                                    if (res.loginURLs.indexOf(properties.url) === -1) {
                                        res.loginURLs.push(properties.url);
                                    }
                                    chrome.storage.local.set({ [STORAGE_KEY]: res });
                                });
                            }
                        });
                    } else {
                        chrome.tabs.create(properties);
                    }
                });
            });
        }
    };

    const ToolTippContainer = ({ entry }: { entry: User }) => (
        <div className="info-container">
            <div>
                <strong>First Name:</strong> {entry.FirstName}
            </div>
            <div>
                <strong>Last Name:</strong> {entry.LastName}
            </div>
            <div>
                <strong>Email:</strong> {entry.Email}
            </div>
            <div>
                <strong>Profile:</strong> {entry.Profile?.Name}
            </div>
            <div>
                <div>
                    <strong>Username:</strong> {entry.Username}
                </div>
                <strong>Org:</strong> {entry.OrgId}
            </div>
            <div>
                <strong>Id:</strong> {entry.Id}
            </div>
        </div>
    );


    return (
        <div className="grid" >
            <div className="labelUsernameContainer" ref={setNodeRef} style={style} {...listeners} {...attributes}>
                <div className="labelEntry">
                    {entry.Label}
                    {settings?.ShowProfileNameInLabel === true ? (
                        <span className="profileName">({entry.Profile?.Name})</span>
                    ) : (
                        ""
                    )}
                </div>

                <div className="usernameEntry">
                    <div>{entry.Username}</div>
                    {settings?.ShowTooltip === true && (
                        <div className="tooltip">
                            <i
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                className="fa fa-info-circle information"
                                aria-hidden="true"
                            ></i>
                        </div>
                    )}
                </div>
            </div>

            {settings?.ShowTooltip === true && showTooltip && <ToolTippContainer entry={entry} />}
            <div className="buttons">
                <button title="Open" className="grid-btn" onClick={openInNewTab}>
                    <i className="fa fa-home fa-sm"></i>
                </button>
                <button title="Edit" className="grid-btn" onClick={handleEdit}>
                    <i className="fa fa-pencil"></i>
                </button>
                <button title="Delete" className="grid-btn" onClick={handleDelete}>
                    <i className="fa fa-trash fa-2xs"></i>
                </button>
            </div>
        </div>
    );
}

export default Entry;

