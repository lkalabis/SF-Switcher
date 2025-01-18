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
            <footer className="footer">
                <div className="footer__settings">
                    <button className="footer__settings-button" title="Settings Icon" onClick={onShowSetings}>
                        <img
                            className="footer__settings-icon"
                            src={doShowSettings === true ? "images/home.png" : "images/settings.png"}
                            alt="Settings Icon"
                        />
                    </button>
                    <div className="footer__version">{APP_VERSION}</div>
                </div>

                <div className="footer__links">
                    <a className="footer__link footer__link--about" href={ABOUT_URL} title="About" target="_blank">
                        {APP_ABOUT}
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

