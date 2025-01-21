import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./locales/i18n";

const rootElement = document.getElementById("root");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
