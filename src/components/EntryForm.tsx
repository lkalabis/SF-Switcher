import React, { useEffect, useState } from "react";
// @ts-ignore
import { sfConn } from "../utils/inspector";
import { REST_ENDPOINT } from "../utils/constants";
import { User } from "../types/User";
import { EntryFormProps } from "../types/EntryProps";
import { createUUID } from "../utils/helper";
import { toast } from "react-toastify";
const LIMIT = 3;

export default function EntryForm({
    username,
    label,
    record,
    isNewEntry,
    onSaveNew,
    onSaveExisting,
    onCancelAdd,
    onCancelEdit,
    currentOrg,
}: EntryFormProps) {
    const [filteredEntries, setFilteredEntries] = useState<User[]>([]);

    const [newEntry, setNewEntry] = useState<User>(record);

    const [showEntrySettings, setShowEntrySettings] = useState(false);

    const fetchData = async (input: string) => {
        try {
            const soqlQuery = `SELECT Id,UserName,FirstName,LastName,Name,Email,Profile.Name FROM User WHERE isActive=true AND (Username LIKE '%${input}%' OR Name LIKE '%${input}%' OR Email LIKE '%${input}%')`;
            const result = await sfConn.rest(`${REST_ENDPOINT}/query?q=${encodeURIComponent(soqlQuery)}`);
            setFilteredEntries(result.records);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // @ts-ignore
    const debounce = (func, delay) => {
        // @ts-ignore
        let debounceTimer;
        // @ts-ignore
        return function (...args) {
            // @ts-ignore
            const context = this;
            // @ts-ignore
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const debounceFetchData = debounce(async (input: string) => {
        await fetchData(input);
    }, 500); // 500ms delay

    useEffect(() => {
        if (!isNewEntry) {
            setNewEntry((prevEntry) => ({
                ...record,
                Label: record.Label !== undefined ? record.Label : prevEntry.Label,
                Username: record.Username !== undefined ? record.Username : prevEntry.Username,
            }));
        }
    }, [label, username]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
        if (input.length >= LIMIT) {
            debounceFetchData(input);
        } else {
            setFilteredEntries([]);
        }
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const updateExistingEntry = () => {
        if (Object.keys(newEntry).length !== 0) {
            if (newEntry.Username === "" || newEntry.Id === "") {
                return toast.error("This is not a valid User", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            newEntry.UUID = createUUID();
            onSaveExisting(newEntry);
        }
    };

    const saveNewEntry = () => {
        if (Object.keys(newEntry).length !== 0) {
            newEntry.UUID = createUUID();
            onSaveNew(newEntry);
        }
    };

    const handleSelectEntry = (filteredEntry: User) => {
        const updatedEntry = {
            ...newEntry,
            ...filteredEntry, // Copy all values from filteredEntry
            Label: newEntry.Label, // Preserve the Label value from newEntry
        };

        setNewEntry(updatedEntry);
        setFilteredEntries([]);
    };

    const resetEntry = () => {
        setNewEntry({
            id: "",
            Id: "",
            FirstName: "",
            LastName: "",
            Email: "",
            Label: "",
            Username: "",
            OrgId: "", // Add OrgId property with appropriate value
            Shortcut: "", // Add Shortcut property with appropriate value
            IsActive: false, // Add IsActive property with appropriate value
            UUID: "", // Add UUID property with appropriate value
            Profile: {
                Name: "",
            },
        });
    };

    return (
        <>
            <div className="editGrid">
                <input
                    className="editLabel"
                    type="text"
                    name="Label"
                    value={newEntry.Label}
                    placeholder="Label"
                    onChange={handleLabelChange}
                />
                <input
                    className="editUsername"
                    type="text"
                    name="Username"
                    value={newEntry.Username}
                    placeholder="Search by Username, Name, or Email"
                    onChange={handleUsernameChange}
                />
                <div className="editEntryButtons">
                    <button title="Save" className="btn" onClick={isNewEntry ? saveNewEntry : updateExistingEntry}>
                        <i className="fa fa-check fa-2xs"></i>
                    </button>
                    <button title="Reset" className="btn" onClick={resetEntry}>
                        <i className="fa fa-trash fa-2xs"></i>
                    </button>
                    <button title="Cancel" className="btn" onClick={isNewEntry ? onCancelAdd : onCancelEdit}>
                        <i className="fa fa-minus fa-2xs"></i>
                    </button>
                </div>
            </div>
            {showEntrySettings}
            {filteredEntries.length > 0 && (
                <div className="filteredEntries">
                    <div className="filteredEntriesList">
                        {filteredEntries.map((filteredEntry, index) => (
                            <div
                                onClick={() => handleSelectEntry(filteredEntry)}
                                className={`entry ${index % 2 === 0 ? "even" : "odd"}`}
                                key={index}
                            >
                                <div className="line name" style={{ cursor: "pointer" }}>
                                    <span>
                                        {filteredEntry.FirstName} {filteredEntry.LastName} (
                                        {filteredEntry.Profile?.Name})
                                    </span>
                                </div>
                                <div className="line username" style={{ cursor: "pointer" }}>
                                    <span>{filteredEntry.Username}</span>
                                </div>
                                <div className="line email" style={{ cursor: "pointer" }}>
                                    <span>{filteredEntry.Email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
