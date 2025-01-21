import React from "react";
import { APP_VERSION, ABOUT_URL, EMAIL, CHANGELOG, CHANGELOG_URL } from "../utils/constants";
import { useTranslation } from "react-i18next";

export default function Footer({
    onShowSetings,
    doShowSettings,
}: {
        onShowSetings: () => void;
        doShowSettings: boolean;
    }) {
    const { t } = useTranslation(); // Hook for translations

    return (
        <>
            <footer className="footer">
                <div className="footer__settings">
                    <button className="footer__settings-button" title="Settings Icon" onClick={onShowSetings}>
                        <div
                className={`footer__settings-icon ${
                    doShowSettings ? "footer__settings-icon--home" : "footer__settings-icon--settings"
                }`}
                aria-label="Settings Icon"
            ></div>
                    </button>
                    <div className="footer__version">{APP_VERSION}</div>
                </div>

                <div className="footer__links">
                    <a className="footer__link footer__link--about" href={ABOUT_URL} title="About" target="_blank">
                        {t("footerAbout")}
                    </a>
                    <a className="footer__link footer__link--email" href={EMAIL} title="Email">
                        <i className="fa fa-envelope"></i>
                    </a>
                    <a className="footer__link footer__link--changelog" href={CHANGELOG_URL} title="Changelog" target="_blank">
                        {CHANGELOG}
                    </a>
                </div>
            </footer>
        </>
    );
}

