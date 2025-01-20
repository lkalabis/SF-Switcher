import React, { useState, useEffect } from "react";
import { SettingsType } from "../types/SettingsType";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import { toastConfig } from "../utils/helper";

export default function Settings({
    settings,
    onSetSettings,
}: {
        settings: SettingsType;
        onSetSettings: (settings: SettingsType) => void;
    }) {
    const [isChanged, setIsChanged] = useState(false);

    const errorConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    };

    const themes = [
        { name: "Light" },
        { name: "Dark" },
    ];


    const applyTheme = (themeName: string) => {
        // Remove existing theme classes
        document.body.classList.remove(...document.body.classList);
        // Add the new theme class
        const themeClass = `theme-${themeName.toLowerCase().replace(" ", "-")}`;
        document.body.classList.add(themeClass);
    };

    const handleThemeChange = (themeName: string) => {
        // @ts-ignore
        onSetSettings((prevSettings) => ({
            ...prevSettings,
            SelectedTheme: themeName,
        }));
        applyTheme(themeName);
        setIsChanged(true);
    };

    useEffect(() => {
        // Load settings, including SelectedTheme, from storage on component mount
        chrome.storage.local.get("sf-user-switcher", (result) => {
            const savedSettings = result["sf-user-switcher"]?.settings;
            if (savedSettings) {
                onSetSettings(savedSettings);
                applyTheme(savedSettings.SelectedTheme || "Light");
            }
        });
    }, [onSetSettings]);

    const handleSave = async () => {
        if (
            settings.UseReLoginFeature &&
                ((settings.MillisecondsToWaitTillRelogin && settings.MillisecondsToWaitTillRelogin < 500) ||
                    (settings.MillisecondsToWaitTillRelogin && settings.MillisecondsToWaitTillRelogin > 10000))
        ) {
            // @ts-ignore
            return toast.error("Value must be between 500 - 10000", errorConfig as ToastOptions<unknown>);
        }

        chrome.storage.local.get("sf-user-switcher", (result) => {
            const data = result["sf-user-switcher"] || {};
            data.settings = { ...settings };

            if (!settings.UseReLoginFeature) {
                data.loginURLs = [];
            }
            // Set the updated data
            chrome.storage.local.set({ "sf-user-switcher": data }, () => {
                if (chrome.runtime.lastError) {
                    return toast.error("The settings couln't be saved", errorConfig as ToastOptions<unknown>);
                }
                toast.success("Settings Saved", toastConfig as ToastOptions<unknown>);
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
                <header className="settings__header">
                    <div className="settings__header-container">
                        <img src="images/icon-48.png" alt="Logo" className="settings__logo" />
                        <div className="settings__title">Settings</div>
                    </div>
                </header>

                <main className="settings__main">
                    <div className="settings__inputs-group--left">
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
                                href="https://lkalabis.github.io/SF-Switcher/pages/settings#label"
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
                                href="https://lkalabis.github.io/SF-Switcher/pages/settings#tooltips"
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
                            <span className="spanInput">Use Re-Login feature?</span>
                            <a
                                className="informationIconLink"
                                href="https://lkalabis.github.io/SF-Switcher/pages/settings#relogin"
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
                    </div>
                    <div className="settings__inputs-group--right">
                        <label>
                            <span>Theme:</span>
                            <select className="settings__theme-select"
                                value={settings.SelectedTheme}
                                onChange={(e) => handleThemeChange(e.target.value)}
                            >
                                {themes.map((theme) => (
                                    <option key={theme.name} value={theme.name}>
                                        {theme.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                    </div>


                    <div className="saveButtonContainer">
                        <button disabled={!isChanged} onClick={handleSave} className="settings__save-button">
    Save
</button>
                    </div>
                </main>
            </div>
        </>
    );
}
