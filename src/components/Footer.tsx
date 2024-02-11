import React from "react";
import { APP_VERSION, APP_AUTHOR, CHANGELOG, CHANGELOG_URL } from "../utils/constants";
export default function Footer() {
    return (
        <>
            <footer>
                <div className="info">
                    <div className="version">{APP_VERSION}</div>
                    <div className="author">{APP_AUTHOR}</div>
                </div>

                <div className="social-icons">
                    <a href="mailto:developer.kalabis.lukas@gmail.com" title="Email">
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
