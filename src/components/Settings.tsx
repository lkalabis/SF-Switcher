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

    const saveSettings = () => {};

    const cancelSettings = () => {};

    return (
        <div className="settings">
            <header className="headerSettingsSection">
                <img src="images/icon-48.png" alt="Logo" className="logo" />
                <div className="settings-text">Settings</div>
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
            </header>
            
            <main className="mainSettingsSection">
                {shoDataSection && <div>Data Section</div>}

                {showLookFeelSection && (
                    <>
                        <h2>Look & Feel Section</h2>
                        <div className="lookAndFeelInputs">
                            <label>
                                <input type="checkbox" name="showProfileNames" />
                                Show Profile Names in Label?
                            </label>
                            <label>
                                <input type="checkbox" name="showAtTopBottom" />
                                Show at top/bottom
                            </label>
                            <div className="lookAndFeelSettingsButtons">
                            <button onClick={() => saveSettings} style={{ marginRight: "15px" }}>
                                Save
                            </button>
                            <button onClick={() => cancelSettings}>Cancel</button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
