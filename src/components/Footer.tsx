import React from "react";
import { APP_VERSION, APP_ABOUT, ABOUT_URL, EMAIL, CHANGELOG, CHANGELOG_URL } from "../utils/constants";
export default function Footer() {
    return (
        <>
            <footer>
                <div className="info">
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
