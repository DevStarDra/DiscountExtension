import React from "react";
import { createRoot } from "react-dom/client";
import "../../assets/css/tailwind.css";
import "../../assets/css/popup.css";
import Popup from "./Popup";

function init() {
    const appContainer = document.createElement("div");
    appContainer.id = "app-container";
    document.body.appendChild(appContainer);

    if (!appContainer) {
        throw new Error("Cannot find appContainer");
    }

    const root = createRoot(appContainer);
    root.render(<Popup />);
}

init()

