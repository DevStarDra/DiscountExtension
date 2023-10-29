import { actionCode } from "../core/helper"

function sendShadowRootId(shadowRootId) {
    chrome.runtime.sendMessage({ code: actionCode.setShadowRootId, shadowRootId: shadowRootId });
}

function getShadowRootId() {
    return chrome.runtime.sendMessage({ code: actionCode.getShadowRootId });
}

function getDomainInfo(domain, callback) {
    chrome.runtime.sendMessage({ code: actionCode.getDomainInfo, domain }, (result) => {
        callback(result)
    })
}

function setStores(stores){
    chrome.runtime.sendMessage({code: actionCode.setStores, store: stores})
}

async function getStores(callback){
    await chrome.runtime.sendMessage({code: actionCode.getStores}, (result)=>{
        callback(result)
    })
}


const ChromeAPI = {
    sendShadowRootId: sendShadowRootId,
    getShadowRootId: getShadowRootId,
    getDomainInfo: getDomainInfo,
    setStores: setStores,
    getStores: getStores
}
export default ChromeAPI