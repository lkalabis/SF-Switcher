import React, { useState } from "react";
import { SettingsType } from "../types/SettingsType";

export default function Settings({
    settings,
    onSetSettings,
}: {
    settings: SettingsType;
    onSetSettings: (settings: SettingsType) => void;
}) {
    const [showDataSection, setShowDataSection] = useState(false);
    const [showLookFeelSection, setShowLookFeelSection] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    const showDataSectionPart = () => {
        setShowDataSection(true);
        setShowLookFeelSection(false);
    };

    const showLookFeelSectionPart = () => {
        setShowDataSection(false);
        setShowLookFeelSection(true);
    };

    const handleSave = async () => {
        console.log("Settings saved");
        console.log(settings);
        // await chrome.storage.local.set({ "sf-user-switcher": { settings: settings } });

        chrome.storage.local.get("sf-user-switcher", (result) => {
            // Get the existing data
            let data = result["sf-user-switcher"];

            // Update the settings part
            data.settings = settings;

            // Set the updated data
            chrome.storage.local.set({ "sf-user-switcher": data });
        });
        setIsChanged(false);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };

    const handleCheckboxChange = (e: any) => {
        const value = e.target.checked;
        const name = e.target.name;

        // @ts-ignore
        onSetSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
        setIsChanged(true);
    };

    return (
        <div className="settings">
            <header className="headerSettingsSection">
                <img src="images/icon-48.png" alt="Logo" className="logo" />
                <div className="settings-text">Settings</div>
                <nav className="navbarSettingsSection">
                    {/*<li>
                            <button onClick={showDataSectionPart}>Data</button>
                        </li>
                        */}

                    <button className="showLookFeelSectionPartButton" onClick={showLookFeelSectionPart}>Look & Feel</button>
                </nav>
            </header>

            <main className="mainSettingsSection">
                {/*showDataSection && <div>Data Section</div>*/}

                {showLookFeelSection && (
                    <>
                        <div className="LookAndFeelHeader">Look & Feel Section</div>
                        <div className="lookAndFeelInputs">
                            <label>
                                <input
                                    type="checkbox"
                                    name="ShowProfileNameInLabel"
                                    checked={settings.ShowProfileNameInLabel}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="spanInput">Show Profile Names in Label?</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="ShowAddFormAtTop"
                                    checked={settings.ShowAddFormAtTop}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="spanInput">Show at top/bottom</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="ShowTooltip"
                                    checked={settings.ShowTooltip}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="spanInput">Show Tooltip?</span>
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="UseReLoginFeature"
                                    checked={settings.UseReLoginFeature}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="spanInput">Use relogin feature?</span>
                            </label>
                            {settings.UseReLoginFeature && (
                                <label>
                                    <input className="reLoginTimeInput" type="number" min="500" max="10000" onChange={handleNumberChange} />
                                    <span className="spanInput">Enter a number between 500 and 10000</span>
                                </label>
                            )}
                            <div className="saveButtonContainer">
                                <button disabled={!isChanged} onClick={handleSave}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
