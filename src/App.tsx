import React, { useEffect, useState } from "react";
import Entry from "./components/Entry";
import Footer from "./components/Footer";
import EntryForm from "./components/EntryForm";
import { getCurrentTabUrl, getModifiedUrl, writeNewEntryToStorage } from "./utils/helper";
// @ts-ignore
import { sfConn } from "./utils/inspector";
import { User } from "./types/User";
import { OrgInfo } from "./types/OrgInfo";
import { LOADING_MESSAGE, STORAGE_KEY } from "./utils/constants";

export default function App() {
    const [showAddEntryForm, setShowAddEntryForm] = useState(false);
    const [showEditEntryForm, setShowEditEntryForm] = useState(true);
    const [showAddButtonContainer, setShowAddButtonContainer] = useState(true);
    const [showEditButtonContainer, setShowEditButtonContainer] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editLabel, setEditLabel] = useState("");
    const [editRecord, setEditRecord] = useState<User>();
    const [currentOrg, setCurrentOrg] = useState<OrgInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<User[] | null>(null);

    async function fetchData() {
        try {
            const currentURL = await getCurrentTabUrl();
            // console.log("currentURL:", currentURL);
            const modifiedUrl = getModifiedUrl(currentURL);
            const currentOrgInfo = await sfConn.getSession(modifiedUrl);
            // console.log("currentOrgInfo:", currentOrgInfo);
            setCurrentOrg(currentOrgInfo);

            const result = await chrome.storage.local.get(STORAGE_KEY);
            const storedEntries = result[STORAGE_KEY] || {};

            const transformedEntries = transformEntries(currentOrgInfo, storedEntries);
            setEntries(transformedEntries);
            setLoading(false);
        } catch (error) {
            console.error("Error in fetchData:", error);
        }
    }

    function transformEntries(currentOrgInfo: OrgInfo | null, storedEntries: Record<string, any>) {
        // console.log("transformEntries:", currentOrgInfo);
        return (
            // @ts-ignore
            storedEntries[currentOrgInfo?.orgId]?.users.map((user: User) => ({
                Email: user.Email,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Id: user.Id,
                Label: user.Label,
                OrgId: user.OrgId,
                Username: user.Username,
                UUID: user.UUID,
                Profile: {
                    Name: user.Profile?.Name,
                },
            })) || []
        );
    }

    useEffect(() => {
        fetchData();
    }, []);

    const addEntry = () => {
        setShowEditButtonContainer(false);
        setShowEditEntryForm(false);
        setShowAddEntryForm((prevShowAddEntryForm) => !prevShowAddEntryForm);
    };

    const editEntry = (entryToEdit: User) => {
        // console.log("entryToEdit:", entryToEdit);
        const index = entries?.findIndex((entry: User) => entry.UUID === entryToEdit.UUID);
        if (index !== undefined && index > -1 && entries) {
            setEditUsername(entries[index].Username);
            setEditLabel(entries[index].Label);
            setEditRecord(entries[index]);
        }

        setShowAddButtonContainer(false);
        setShowAddEntryForm(false);
        setShowEditEntryForm(true);
        setShowEditButtonContainer(true);
    };

    const cancelAddEntry = () => {
        setShowAddEntryForm(false);
    };

    const cancelEditEntry = () => {
        setShowEditEntryForm(false);
        setShowEditButtonContainer(false);
        setShowAddButtonContainer(true);
    };

    const saveNewEntry = async (newEntry: User) => {
        setEntries([...(entries || []), newEntry]);
        setShowEditEntryForm(false);
        setShowEditButtonContainer(false);
        setShowAddButtonContainer(true);
        setShowAddEntryForm(false);
        if (currentOrg) {
            await writeNewEntryToStorage(newEntry, currentOrg);
            await fetchData();
        }
    };

    const updateExistingEntry = async (updateEntry: User) => {
        // console.log("oldRecord:", editRecord);
        // console.log("updateEntry:", updateEntry);
        try {
            if (editRecord) {
                await deleteEntry(editRecord, false);
            }
            setEntries([...(entries || []), updateEntry]);
            setShowEditEntryForm(false);
            setShowEditButtonContainer(false);
            setShowAddButtonContainer(true);
            setShowAddEntryForm(false);
            if (currentOrg) {
                writeNewEntryToStorage(updateEntry, currentOrg);
                loadRecord();
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    const loadRecord = async () => {
        // Update state to remove the entry
        const result = await chrome.storage.local.get(STORAGE_KEY);
        const storedEntries = result[STORAGE_KEY] || {};

        const transformedEntries = transformEntries(currentOrg, storedEntries);
        setEntries(transformedEntries);
    };

    const deleteTes = async (editRecord: User, withConfirmation: boolean) => {
        // console.log("deleteTes:", editRecord);
        try {
            await deleteEntry(editRecord, withConfirmation);
            loadRecord();
        } catch (error) {
            if ((error as Error).message === "Deletion canceled by user") {
                // console.log("User canceled the deletion");
            } else {
                console.error(error);
            }
        }
    };

    const deleteEntry = (entryToDelete: User, withConfirmation: boolean): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (withConfirmation) {
                const isConfirmed = window.confirm("Are you sure you want to delete this entry?");
                if (!isConfirmed) {
                    reject(new Error("Deletion canceled by user"));
                    return;
                }
            }

            // Retrieve the existing data from storage
            chrome.storage.local.get(STORAGE_KEY, (result) => {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                const storageData = result[STORAGE_KEY] || {};

                // Delete the entry with the matching ID
                Object.keys(storageData).forEach((OrgId) => {
                    storageData[OrgId].users = storageData[OrgId].users.filter(
                        (user: User) => user.Id !== entryToDelete.Id || user.Label !== entryToDelete.Label,
                    );
                });

                chrome.storage.local.set({ [STORAGE_KEY]: storageData }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error:", chrome.runtime.lastError);
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        // console.log("Entry deleted from storage");
                        resolve();
                    }
                });
            });
        });
    };

    const renderAddEntryForm = () => {
        return (
            <div className="addButtonContainer">
                {!showAddEntryForm && (
                    <button title="Add Entry" className="btn addEntryButton" onClick={addEntry}>
                        <i className="fa fa-plus"></i>
                    </button>
                )}
                {showAddEntryForm && (
                    <EntryForm
                        isNewEntry={true}
                        currentOrg={currentOrg!}
                        onSaveNew={saveNewEntry}
                        onCancelAdd={cancelAddEntry}
                        onCancelEdit={cancelEditEntry}
                        username={""}
                        label={""}
                        // @ts-ignore
                        record={""}
                        onSaveExisting={function (entry: User): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                )}
            </div>
        );
    };

    const renderEditEntryForm = () => {
        return (
            <div className="editButtonContainer">
                {showEditEntryForm && (
                    <EntryForm
                        isNewEntry={false}
                        username={editUsername}
                        record={editRecord!}
                        label={editLabel}
                        onSaveExisting={updateExistingEntry}
                        onCancelAdd={cancelAddEntry}
                        onCancelEdit={cancelEditEntry}
                        currentOrg={currentOrg!}
                        onSaveNew={function (entry: User): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                )}
            </div>
        );
    };
    return (
        <div className="container">
            {showAddButtonContainer && renderAddEntryForm()}
            {showEditButtonContainer && renderEditEntryForm()}

            <div className="gridContainer">
                {loading ? (
                    LOADING_MESSAGE
                ) : (
                    <>
                        {entries?.map((entry) => (
                            <Entry key={entry.Id} entry={entry} onDelete={deleteTes} onEdit={editEntry} />
                        ))}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
