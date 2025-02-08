import React, { useEffect, useState } from "react";
import Entry from "./components/Entry";
import Footer from "./components/Footer";
import EntryForm from "./components/EntryForm";
import {
    getCurrentTabUrl,
    getModifiedUrl,
    toastConfig,
    writeNewEntryToStorage,
    writeAllEntriesToStorage,
} from "./utils/helper";
// @ts-ignore
import { sfConn } from "./utils/inspector";
import { User } from "./types/User";
import { SettingsType } from "./types/SettingsType";
import { OrgInfo } from "./types/OrgInfo";
import { LOADING_MESSAGE, STORAGE_KEY } from "./utils/constants";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./components/Settings";
import { useTranslation } from "react-i18next"; 

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
    const [isValidURL, setisValidURL] = useState(true);
    const [entries, setEntries] = useState<User[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<SettingsType>({
        ShowProfileNameInLabel: false,
        ShowTooltip: true,
        UseReLoginFeature: true,
        MillisecondsToWaitTillRelogin: 1000,
        SelectedTheme: "Light",
        SelectedLanguage: "en",
        ShowUserLink: false,
    });
    const { t, i18n } = useTranslation(); // Hook for translations
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<string | null>(null);


    const onDragStart = (event: React.DragEvent<HTMLDivElement>, entryId: string) => {
        setDraggedItem(entryId);
    };

    const onDragEnd = () => {
        setDraggedItem(null);
        setDropTarget(null);
    };

    const onDrop = async(event: React.DragEvent<HTMLDivElement>, targetId: string) => {
        event.preventDefault();
        if (!draggedItem || draggedItem === targetId) return;

        // Find indexes of dragged and target entries
        const draggedIndex = entries.findIndex((entry) => entry.Id === draggedItem);
        const targetIndex = entries.findIndex((entry) => entry.Id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Swap the items in the array
        const newEntries = [...entries];
        const [movedItem] = newEntries.splice(draggedIndex, 1);
        newEntries.splice(targetIndex, 0, movedItem);

        setEntries(newEntries);
        setDraggedItem(null);
        setDropTarget(null);

        // Write the new order to storage
        if (currentOrg) {
            try {
                await writeAllEntriesToStorage(newEntries, currentOrg);
            } catch (error) {
                console.error("Error saving new entry order:", error);
            }
        }

    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>, targetId: string) => {
        event.preventDefault();

        // Ensure we only set dropTarget if it's different
        if (dropTarget !== targetId) {
            setDropTarget(targetId);
        }
    };

    async function fetchData() {
        try {
            const currentURL = await getCurrentTabUrl();
            const modifiedUrl = getModifiedUrl(currentURL);
            const currentOrgInfo = await sfConn.getSession(modifiedUrl);
            setCurrentOrg(currentOrgInfo);

            const result = await chrome.storage.local.get(STORAGE_KEY);
            const storedEntries = result[STORAGE_KEY] || {};
            setSettings(result[STORAGE_KEY].settings || {});

            const savedSettings = result["sf-user-switcher"]?.settings;
            if (savedSettings.SelectedTheme) {
                applyTheme(savedSettings.SelectedTheme || "Light");
            } else {
                applyTheme("Light");
            }
            if (savedSettings.SelectedLanguage) {
                i18n.changeLanguage(savedSettings.SelectedLanguage);
            }

            const transformedEntries = transformEntries(currentOrgInfo, storedEntries);
            if (transformedEntries.length === 0) {
                addEntry();
            } else {
                setEntries(transformedEntries);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            setisValidURL(false);
            setShowAddButtonContainer(false);
            setShowEditButtonContainer(false);
        }
    }

    const applyTheme = (themeName: string) => {
        document.body.classList.remove(...document.body.classList);
        const themeClass = `theme-${themeName.toLowerCase().replace(" ", "-")}`;
        document.body.classList.add(themeClass);
    };

    const transformEntries = (currentOrgInfo: OrgInfo | null, storedEntries: Record<string, any>): User[] => {
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addEntry = () => {
        setShowEditButtonContainer(false);
        setShowEditEntryForm(false);
        setShowAddEntryForm((prevShowAddEntryForm) => !prevShowAddEntryForm);
    };

    const editEntry = (entryToEdit: User) => {
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
        if (!newEntry.Id) {
            return toast.error(t("errorInvalidUser"), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        if (newEntry.Label) {
            newEntry.Label = newEntry.Label.trim();
        }
        newEntry.Username = newEntry.Username.trim();
        setShowEditEntryForm(false);
        setShowEditButtonContainer(false);
        setShowAddButtonContainer(true);
        setShowAddEntryForm(false);
        if (currentOrg) {
            await writeNewEntryToStorage(newEntry, currentOrg);
            await fetchData();
            toast.success(t("entrySavedMessage"), toastConfig as ToastOptions<unknown>);
        }
    };

    const updateExistingEntry = async (updateEntry: User) => {
        try {
            if (editRecord) {
                const indexOfEntry = await deleteEntry(editRecord, false);
                if (indexOfEntry === -1) {
                    return;
                }

                if (updateEntry.Label) {
                    updateEntry.Label = updateEntry.Label.trim();
                }
                updateEntry.Username = updateEntry.Username.trim();
                setShowEditEntryForm(false);
                setShowEditButtonContainer(false);
                setShowAddButtonContainer(true);
                setShowAddEntryForm(false);
                if (currentOrg) {
                    await writeNewEntryToStorage(updateEntry, currentOrg, indexOfEntry);
                    toast.success("Entry Changed", toastConfig as ToastOptions<unknown>);
                    await loadRecords();
                }
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };
    const loadRecords = async () => {
        // Update state to remove the entry
        const result = await chrome.storage.local.get(STORAGE_KEY);
        const storedEntries = result[STORAGE_KEY] || {};

        const transformedEntries = transformEntries(currentOrg, storedEntries);
        setEntries(transformedEntries);
        if (transformedEntries.length === 0) {
            addEntry();
        } else {
            setEntries(transformedEntries);
        }
    };

    const deleteExistingEntry = async (editRecord: User, withConfirmation: boolean) => {
        try {
            await deleteEntry(editRecord, withConfirmation);
            toast.info("Entry Deleted", toastConfig as ToastOptions<unknown>);
            await loadRecords();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteEntry = (entryToDelete: User, withConfirmation: boolean): Promise<number> => {
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
                // @ts-ignore
                const indexOfEntry = storageData[currentOrg?.orgId].users.findIndex(
                    (user: User) => user.UUID === entryToDelete.UUID,
                );
                if (indexOfEntry > -1) {
                    // @ts-ignore
                    const allUserEntries = storageData[currentOrg?.orgId].users;
                    // @ts-ignore
                    const updatedUserEntries = allUserEntries
                    .slice(0, indexOfEntry)
                    .concat(allUserEntries.slice(indexOfEntry + 1));
                    // @ts-ignore
                    storageData[currentOrg?.orgId].users = updatedUserEntries;
                }

                chrome.storage.local.set({ [STORAGE_KEY]: storageData }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error:", chrome.runtime.lastError);
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(indexOfEntry);
                    }
                });
            });
        });
    };
    const toggleView = () => {
        setShowSettings((prevShowAddEntryForm) => !prevShowAddEntryForm);
    };

    const renderAddEntryForm = () => {
        return (
            <>
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
            </>
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
        // @ts-ignore
        <div className="container">
            {showSettings ? (
                // Render what you want to show when showSettings is true
                <Settings settings={settings} onSetSettings={setSettings} />
            ) : (
                    <>
                        <ToastContainer
                            position="top-right"
                            autoClose={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            theme="dark"
                        />
                        {showAddButtonContainer && renderAddEntryForm()}
                        {showEditButtonContainer && renderEditEntryForm()}

                        <div className="gridContainer">
                            {!isValidURL ? (
                                <div className="invalidURLMessage">
                                    <h3>{t("invalidURLHeader")}</h3>
                                    <p>{t("invalidURLMessage")}
                                    </p>
                                </div>
                            ) : (
                                    <>
                                        {loading ? (
                                            LOADING_MESSAGE
                                        ) : (
                                                <>
                                                    {entries?.map((entry) => (
                                                        <React.Fragment key={entry.Id}>
                                                            {/* 🔥 Show drop indicator BEFORE an entry when it's a target */}
                                                            {dropTarget === entry.Id && <div className="drop-indicator"></div>}
                                                            <Entry
                                                                settings={settings}
                                                                key={entry.Id}
                                                                entry={entry}
                                                                onDelete={deleteExistingEntry}
                                                                onEdit={editEntry}
                                                                onDragStart={onDragStart}
                                                                onDragEnd={onDragEnd}
                                                                onDrop={onDrop}
                                                                isDragged={draggedItem === entry.Id}
                                                                isDropTarget={dropTarget === entry.Id}
                                                                onDragOver={onDragOver}
                                                            />
                                                        </React.Fragment>
                                                    ))}
                                                    {dropTarget === null && draggedItem && <div className="drop-indicator"></div>}
                                                </>
                                            )}
                                    </>
                                )}
                        </div>
                    </>
                )}
            <Footer doShowSettings={showSettings} onShowSetings={toggleView} />
        </div>
    );
}
