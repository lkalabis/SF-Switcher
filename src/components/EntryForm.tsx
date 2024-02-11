import React, { useEffect, useState } from "react";
// @ts-ignore
import { sfConn } from "../utils/inspector";
import { REST_ENDPOINT } from "../utils/constants";
import { User } from "../types/User";
import { EntryFormProps } from "../types/EntryProps";
import { createUUID } from "../utils/helper";

const LIMIT = 2;

function EntryForm({
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

    const fetchData = async (input: string) => {
        try {
            const soqlQuery = `SELECT Id,UserName,FirstName,LastName,Name,Email,Profile.Name FROM User WHERE isActive=true AND (Username LIKE '%${input}%' OR Name LIKE '%${input}%' OR Email LIKE '%${input}%')`;
            const result = await sfConn.rest(`${REST_ENDPOINT}/query?q=${encodeURIComponent(soqlQuery)}`);
            // console.log("result", result.records);
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
        // console.log("useEffect is called");
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
        // console.log("handleUsernameChange", name, value);
        setNewEntry({ ...newEntry, [name]: value });

        if (input.length >= LIMIT) {
            debounceFetchData(input);
        } else {
            setFilteredEntries([]);
        }
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // console.log("handleLabelChange", name, value);
        setNewEntry({ ...newEntry, [name]: value });
    };

    const updateExistingEntry = () => {
        // console.log("existing entry", newEntry);
        if (Object.keys(newEntry).length !== 0) {
            newEntry.UUID = createUUID();
            onSaveExisting(newEntry);
        }
    };

    const saveNewEntry = () => {
        // console.log("new entry", newEntry);
        if (Object.keys(newEntry).length !== 0) {
            newEntry.UUID = createUUID();
            onSaveNew(newEntry);
        }
    };

    const handleSelectEntry = (entry: User) => {
        // console.log("selected entry " + JSON.stringify(entry));
        setNewEntry(entry);
        setFilteredEntries([]);
    };

    const resetEntry = () => {
        setNewEntry({
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
                    placeholder="Username"
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
            {filteredEntries.length > 0 && (
                <div className="filteredEntries">
                    <div className="filteredEntriesList">
                        {filteredEntries.map((entry, index) => (
                            <div
                                onClick={() => handleSelectEntry(entry)}
                                className={`entry ${index % 2 === 0 ? "even" : "odd"}`}
                                key={index}
                            >
                                <div className="line name" style={{ cursor: "pointer" }}>
                                    <span>
                                        {entry.FirstName} {entry.LastName} ({entry.Profile?.Name})
                                    </span>
                                </div>
                                <div className="line username" style={{ cursor: "pointer" }}>
                                    <span>{entry.Username}</span>
                                </div>
                                <div className="line email" style={{ cursor: "pointer" }}>
                                    <span>{entry.Email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default EntryForm;
