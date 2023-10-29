import React from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/popup.css";
import SideBarApp from "./contentScript/SideBarApp"
import { generateShadowRootId } from "./core/common";
import { classNameConstant } from "./core/helper";
import $ from "jquery";
import { render } from 'react-dom';
import ComparisonScreen from "./pages/ComparisonScreen";
import ChromeAPI from "./API/chromeAPI";
let root_id = "";

function init ()
{
    const appContainer = document.createElement( "div" );
    appContainer.id = "app-container";
    document.body.appendChild( appContainer );

    if ( !appContainer )
    {
        throw new Error( "Cannot find appContainer" );
    }

    // const root = createRoot( appContainer );
    const root = document.getElementById( "app-container" )
    root.attachShadow( { mode: "open" } );

    // root.render( <ComparisonScreen /> );

    render( <SideBarApp />, root.shadowRoot );

}

init()


