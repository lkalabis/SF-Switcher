import React from "react";
import { APP_VERSION, APP_ABOUT, ABOUT_URL, EMAIL, CHANGELOG, CHANGELOG_URL } from "../utils/constants";
export default function Footer({
    onShowSetings,
    doShowSettings,
}: {
    onShowSetings: () => void;
    doShowSettings: boolean;
}) {
    return (
        <>
            <footer>
                <div className="settingsIcon">
                    <button title="Settings Icon" onClick={onShowSetings}>
                        <img
                            src={doShowSettings === true ? "images/home.png" : "images/settings.png"}
                            alt="Settings Icon"
                        />
                    </button>
                    <div className="version">{APP_VERSION}</div>
                </div>

                <div className="social-icons">
                    <a href={ABOUT_URL} title="About" target="_blank">
                        {APP_ABOUT}
                    </a>
                    <a href={EMAIL} title="Email">
                        <i className="fa fa-envelope"></i>
                    </a>
                    <a href={CHANGELOG_URL} title="Changelog" target="_blank">
                        {CHANGELOG}
                    </a>
                </div>
            </footer>
        </>
    );
}
