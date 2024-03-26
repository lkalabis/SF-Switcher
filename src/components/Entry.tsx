import React, { useState } from "react";
import { getCurrentTabUrl, getModifiedUrl } from "../utils/helper";
import { User } from "../types/User";
import { SettingsType } from "../types/SettingsType";

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
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Query active tab
            const activeTab = tabs[0];

            // Send a message to the content script
            // @ts-ignore
            chrome.tabs.sendMessage(activeTab.id, { message: "Is User Logged In?" }, (response) => {
                const isUserLoggedIn = response.response;
                if (isUserLoggedIn) {
                    // logout current user
                    const url = `${modifiedUrl}/${LOGOUT_URL}`;

                    chrome.tabs.sendMessage(
                        // @ts-ignore
                        activeTab.id,
                        { message: "logoutUser", logoutUrl: url, loginUrl: properties.url },
                    );
                } else {
                    chrome.tabs.create(properties);
                }
            });
        });
    };

    return (
        <div className="grid">
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

            {settings?.ShowTooltip === true && showTooltip && (
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
            )}
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
