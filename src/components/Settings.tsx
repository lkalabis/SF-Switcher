import React from "react";

export default function Settings() {
    const [shoDataSection, setShowDataSection] = React.useState(true);
    const [showLookFeelSection, setShowLookFeelSection] = React.useState(false);
    const [showUpdatesSection, setShowUpdatesSection] = React.useState(false);

    const showDataSectionPart = () => {
        setShowDataSection(true);
        setShowLookFeelSection(false);
        setShowUpdatesSection(false);
    };

    const showLookFeelSectionPart = () => {
        setShowDataSection(false);
        setShowLookFeelSection(true);
        setShowUpdatesSection(false);
    };

    const showUpdatesSectionPart = () => {
        setShowDataSection(false);
        setShowLookFeelSection(false);
        setShowUpdatesSection(true);
    };

    return (
        <div className="settings">
            <header className="headerSettingsSection">
                <img src="images/icon-48.png" alt="Logo" className="logo" />
            </header>
            <nav className="navbarSettingsSection">
                <ul>
                    <li>
                        <button onClick={showDataSectionPart}>Data</button>
                    </li>
                    <li>
                        <button onClick={showLookFeelSectionPart}>Look & Feel</button>
                    </li>
                    <li>
                        <button onClick={showUpdatesSectionPart}>Updates</button>
                    </li>
                </ul>
            </nav>
            <main className="mainSettingsSection">
                <h1>Settings</h1>
                <p>Settings content</p>
                {shoDataSection && <div>Data Section</div>}
                {showLookFeelSection && <div>Look & Feel Section</div>}
                {showUpdatesSection && <div>Updates Section</div>}
            </main>
        </div>
    );
}
