import React from 'react';
import SideBarApp from './SideBarApp';
import { createRoot } from 'react-dom/client';
import { classNameConstant, actionCode, ISDEV } from "../core/helper";
import { generateShadowRootId } from "../core/common";
import ChromeAPI from "../API/chromeAPI"
import $ from "jquery";
import { ProvideAuth } from '../store/use-auth';

function removeAllShadowRoot() {
    if ($(`.${classNameConstant.shadowRoot}`).length > 0)
        $(`.${classNameConstant.shadowRoot}`).remove();

}

function addRightSideBarWidget() {
    const contentRoot = document.createElement("div");
    contentRoot.id = generateShadowRootId(10);
    contentRoot.className = classNameConstant.shadowRoot;
    const shadowRoot = contentRoot.attachShadow({ mode: "open" });
    const shadowWrapper = document.createElement("div");
    shadowWrapper.id = "root";
    document.body.append(contentRoot);
    shadowRoot.append(shadowWrapper);
    const root = createRoot(shadowWrapper);
    ChromeAPI.sendShadowRootId(contentRoot.id);
    if (ISDEV) {
        localStorage.setItem('shadowRootId', contentRoot.id);
    } else {
        chrome.storage.sync.set({ 'shadowRootId': contentRoot.id })
    }
    chrome.runtime.sendMessage({code: actionCode.getStores}, function(result){  
        // root.render(<SideBarApp />);      
        var domain = new URL(location.href).hostname.replace("www.", "");  
        if(result.loaded == 0 || result.list.filter(el=>el.domain == domain).length > 0)
            root.render(<SideBarApp />);     
        else console.log('unregiesterd domain');
    });
}
 
try {
    removeAllShadowRoot(); 
    addRightSideBarWidget();
}
catch (error) {

}

