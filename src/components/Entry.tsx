import React from "react";
import { getCurrentTabUrl, getModifiedUrl } from "../utils/helper";
import { User } from "../types/User";

function Entry({
    entry,
    onDelete,
    onEdit,
}: {
    entry: User;
    onDelete: (entry: User, withConfirmation: boolean) => void;
    onEdit: (entry: User) => void;
}) {
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
        // console.log(entry.OrgId, entry.Id, target, modifiedUrl);
        const properties = {
            active: true,
            url: `${modifiedUrl}/servlet/servlet.su?oid=${entry.OrgId}&suorgadminid=${entry.Id}&targetURL=${target}&retURL=${target}`,
        };
        // console.log(target, properties);
        chrome.tabs.create(properties);
    };

    return (
        // console.log("Entry:", entry),
        <div className="grid">
            <div className="labelEntry">
                {entry.Label} <span className="profileName">({entry.Profile?.Name})</span>
            </div>
            <div className="usernameEntry">{entry.Username}</div>

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
