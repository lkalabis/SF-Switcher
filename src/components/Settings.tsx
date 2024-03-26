import React, { useState } from "react";
import { SettingsType } from "../types/SettingsType";
import { ToastContainer, toast } from "react-toastify";

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

        if (
            settings.UseReLoginFeature &&
            ((settings.MillisecondsToWaitTillRelogin && settings.MillisecondsToWaitTillRelogin < 500) ||
                (settings.MillisecondsToWaitTillRelogin && settings.MillisecondsToWaitTillRelogin > 10000))
        ) {
            // @ts-ignore
            return toast.error("Value must be between 500 - 10000", {
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
        // await chrome.storage.local.set({ "sf-user-switcher": { settings: settings } });

        chrome.storage.local.get("sf-user-switcher", (result) => {
            // Get the existing data
            let data = result["sf-user-switcher"];

            // Update the settings part
            data.settings = settings;

            if (!settings.UseReLoginFeature) {
                data.loginURLs = [];
            }
            // Set the updated data
            chrome.storage.local.set({ "sf-user-switcher": data }, () => {
                console.log("Settings saved");
                if (chrome.runtime.lastError) {
                    return toast.error("The settings couln't be saved", {
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
                toast.success("Settings Saved", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            });
        });
        setIsChanged(false);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        // @ts-ignore
        onSetSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));

        setIsChanged(true);
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
            <div className="settings">
                <header className="headerSettingsSection">
                    <div className="headerSettingsSectionContainer">
                        <img src="images/icon-48.png" alt="Logo" className="logo" />
                        <div className="settings-text">Settings</div>
                    </div>
                    <nav className="navbarSettingsSection">
                        {/*<li>
                            <button onClick={showDataSectionPart}>Data</button>
                        </li>
                        */}

                        <button className="showLookFeelSectionPartButton" onClick={showLookFeelSectionPart}>
                            Look & Feel
                        </button>
                    </nav>
                </header>

                <main className="mainSettingsSection">
                    {showLookFeelSection && (
                        <>
                            <div className="lookAndFeelInputs">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="ShowProfileNameInLabel"
                                        checked={settings.ShowProfileNameInLabel}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="spanInput">Show Profile Name in Label?</span>
                                    <a
                                        className="informationIconLink"
                                        href="https://lkalabis.github.io/SF-Switcher/#profileNameInLabel"
                                        target="_blank"
                                    >
                                        <i className="informationIcon fa fa-question-circle" aria-hidden="true"></i>
                                    </a>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="ShowAddFormAtTop"
                                        checked={settings.ShowAddFormAtTop}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="spanInput">Show 'Add Entry' at top?</span>
                                    <a
                                        className="informationIconLink"
                                        href="https://lkalabis.github.io/SF-Switcher/#addEntryatTop"
                                        target="_blank"
                                    >
                                        <i className="informationIcon fa fa-question-circle" aria-hidden="true"></i>
                                    </a>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="ShowTooltip"
                                        checked={settings.ShowTooltip}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="spanInput">Show Tooltip?</span>
                                    <a
                                        className="informationIconLink"
                                        href="https://lkalabis.github.io/SF-Switcher/#showTooltip"
                                        target="_blank"
                                    >
                                        <i className="informationIcon fa fa-question-circle" aria-hidden="true"></i>
                                    </a>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="UseReLoginFeature"
                                        checked={settings.UseReLoginFeature}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="spanInput">Use relogin feature?</span>
                                    <a
                                        className="informationIconLink"
                                        href="https://lkalabis.github.io/SF-Switcher/#useReloginFeature"
                                        target="_blank"
                                    >
                                        <i className="informationIcon fa fa-question-circle" aria-hidden="true"></i>
                                    </a>
                                </label>
                                {settings.UseReLoginFeature && (
                                    <label>
                                        <input
                                            className="reLoginTimeInput"
                                            name="MillisecondsToWaitTillRelogin"
                                            type="number"
                                            min="500"
                                            value={settings.MillisecondsToWaitTillRelogin}
                                            max="10000"
                                            onChange={(e) => handleNumberChange(e)}
                                            placeholder="500-10000"
                                        />
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
        </>
    );
}
