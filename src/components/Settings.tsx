import React, { useState, useEffect } from "react";
import { SettingsType } from "../types/SettingsType";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import { toastConfig } from "../utils/helper";
import { useTranslation } from "react-i18next";

export default function Settings({
    settings,
    onSetSettings,
}: {
        settings: SettingsType;
        onSetSettings: (settings: SettingsType) => void;
    }) {
    const { t, i18n } = useTranslation(); // Hook for translations
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

    const languages = [
        { val: "en", name: "English" },
        { val: "de", name: "Deutsch" },
        { val: "es", name: "Español" },
        { val: "fr", name: "Français" },
        { val: "it", name: "Italiano" },
        { val: "nl", name: "Nederlands" },
        { val: "pl", name: "Polski" },
        { val: "pt", name: "Português" },
    ];
    
    const applyLanguage = (languageName: string) => {
        i18n.changeLanguage(languageName.toLowerCase());
    };

    const applyTheme = (themeName: string) => {
        // Remove existing theme classes
        document.body.classList.remove(...document.body.classList);
        // Add the new theme class
        const themeClass = `theme-${themeName.toLowerCase().replace(" ", "-")}`;
        document.body.classList.add(themeClass);
    };

    const handleLanguageChange = (languageName: string) => {
        // @ts-ignore
        onSetSettings((prevSettings) => ({
            ...prevSettings,
            SelectedLanguage: languageName,
        }));
        applyLanguage(languageName);
        setIsChanged(true);
    }

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
            return toast.error(t("valueError"), errorConfig as ToastOptions<unknown>);
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
                    return toast.error(t("saveError"), errorConfig as ToastOptions<unknown>);
                }
                toast.success(t('saveSuccess'), toastConfig as ToastOptions<unknown>);
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
                        <div className="settings__title">{t("settingsTitle")}</div>
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
                            <span className="spanInput">{t("showProfileName")}</span>
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
                            <span className="spanInput">{t('showTooltip')}</span>
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
                                name="ShowUserLink"
                                checked={settings.ShowUserLink}
                                onChange={handleCheckboxChange}
                            />
                            <span className="spanInput">{t('showUserLink')}</span>
                            <a
                                className="informationIconLink"
                                href="https://lkalabis.github.io/SF-Switcher/pages/settings#userlink"
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
                            <span className="spanInput">{t("useReLogin")}</span>
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
                            <span>{t("theme")}</span>
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
                        <label>
                            <span>{t("language")}</span>
                            <select className="settings__theme-select" 
                            value={settings.SelectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)} >

                                {languages.map((language) => (
                                    <option key={language.name} value={language.val}>
                                        {language.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>


                    <div className="saveButtonContainer">
                        <button disabled={!isChanged} onClick={handleSave} className="settings__save-button">
    {t("save")}
</button>
                    </div>
                </main>
            </div>
        </>
    );
}
