import React from "react";

export default function Settings() {
    const [shoDataSection, setShowDataSection] = React.useState(true);
    const [showLookFeelSection, setShowLookFeelSection] = React.useState(false);

    const showDataSectionPart = () => {
        setShowDataSection(true);
        setShowLookFeelSection(false);
    };

    const showLookFeelSectionPart = () => {
        setShowDataSection(false);
        setShowLookFeelSection(true);
    };

    return (
        <div className="settings">
            <header className="headerSettingsSection">
                <img src="images/icon-48.png" alt="Logo" className="logo" />
                <div className="settings-text">Settings</div>
            </header>
            <nav className="navbarSettingsSection">
                <ul>
                    <li>
                        <button onClick={showDataSectionPart}>Data</button>
                    </li>
                    <li>
                        <button onClick={showLookFeelSectionPart}>Look & Feel</button>
                    </li>
                </ul>
            </nav>
            <main className="mainSettingsSection">
                
                <p>Settings content</p>
                {shoDataSection && <div>Data Section</div>}
                {showLookFeelSection && <div>Look & Feel Section</div>}
            </main>
        </div>
    );
}
