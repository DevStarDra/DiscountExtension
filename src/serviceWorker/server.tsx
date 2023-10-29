

var domainInfos = {
  activeDomains: {
    loaded: 0,
    list: [],
  },
  detailDomains: {
    loaded: 0,
    list: [],
  },
};
var storeInfo = {
  loaded: 0,
  list: [],
};

var featureInfo = {
  loaded: 0,
  list: []
}

var languages = {
  ro: {
    loaded: 0,
    translation: []
  },
  en: {
    loaded: 0,
    translation: []
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ buttonTop: 150 });
    chrome.runtime.setUninstallURL(
      "https://discount.ro/dezinstalare/?browser=chrome"
    );
    chrome.tabs.create({
      url: "https://discount.ro/chrome-extension-onboarding/",
      active: true,
    });
  }
  return false;
});

chrome.windows.onCreated.addListener(() => { 
  // getDomainInfos();
});

chrome.runtime.onStartup.addListener(()=>{
  // featureInfo.loaded = 0; 
  // languages.ro.loaded = 0;
  // languages.en.loaded = 0;
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") { 
    updateTabProcess(tabId, changeInfo, tab);
  }
});

// function createTab ( url, closeAfter, move )
// {

//     if ( typeof closeAfter == 'undefined' )
//         closeAfter = true;

//     if ( typeof move == 'undefined' )
//         move = false;

//     return new Promise( resolve =>
//     {
//         chrome.tabs.create( { 'url': url, selected: false, pinned: move }, async tab =>
//         {

//             if ( move )
//             {
//                 chrome.tabs.move( tab.id, { index: 0 } );
//             }

//             if ( closeAfter )
//             {
//                 chrome.tabs.onUpdated.addListener( function listener ( tabId, info )
//                 {

//                     if ( info.status === 'complete' && tabId === tab.id && ( !new RegExp( affiliatePlatformKeywords.join( "|" ) ).test( tab.url ) ) )
//                     {
//                         chrome.tabs.onUpdated.removeListener( listener );

//                         setTimeout( function ()
//                         {
//                             chrome.tabs.remove( tabId, function () { } );
//                         }, 3500 );

//                         resolve( tab );
//                     }
//                 } );
//             }

//         } );
//     } );
// }

// function checkActiveDomainLifeTime() {
//     if (domainInfos.activeDomains.loaded) {
//         if (Date.now() - domainInfos.activeDomains.loaded > constant.ACTIVE_DOMAINS_LIFETIME)
//             domainInfos.activeDomains.loaded = 0;
//     }
//     if (domainInfos.detailDomains.loaded) {
//         if (Date.now() - domainInfos.detailDomains.loaded > constant.ACTIVE_DOMAINS_LIFETIME)
//             domainInfos.detailDomains.loaded = 0;
//     }
// }

// function loadActiveDomains() {
//     if (domainInfos.activeDomains.loaded) return;
//     fetch(constant.URL_GET_ACTIVE_DOMAINS).then(response => {
//         if (response.status == 200) {
//             response.json().then(result => {
//                 domainInfos.activeDomains.loaded = Date.now();
//                 domainInfos.activeDomains.list = result;
//             });
//         } else {
//         }
//     })
// }

// function loadDetailActiveDomains() {
//     if (domainInfos.detailDomains.loaded) return;
//     fetch(constant.URL_GET_DETAIL_ACTIVE_DOMAINS).then(response => {
//         if (response.status == 200) {
//             response.json().then(result => {
//                 domainInfos.detailDomains.loaded = Date.now();
//                 domainInfos.detailDomains.list = result;
//             });
//         } else {
//         }
//     })
// }

// function getDomainInfos() {
//     checkActiveDomainLifeTime();
//     loadActiveDomains();
//     loadDetailActiveDomains();
// }

function updateTabProcess(tabId, changeInfo, tab) {
  // var newUrl = new URL(tab.url);
  // var currentDomain = newUrl.hostname.replace('www.', '');
  // var validSite = false;
  // console.log(domainInfos)
  // if (domainInfos.activeDomains.list.length > 0) {
  //     if (domainInfos.activeDomains.list.includes(currentDomain))
  //         validSite = true;
  // }
  // else {
  //     getDomainInfos();
  //     validSite = true;
  // }

  // if (!validSite)
  //     return false;

  // if (currentDomain.indexOf('chrome://') != -1 || currentDomain.indexOf('127.') != -1)
  //     return false;

  // if (currentDomain.indexOf('google.') == -1) {
  //     if (currentDomain.indexOf('discount.ro') !== -1) {
  //         chrome.scripting.insertCSS({
  //             css: ".discountchromeextension { display:none !important; } ",
  //             target: {
  //                 tabId: tabId
  //             }
  //         }, function () { });

  //     }
  chrome.scripting.executeScript(
    {
      files: ["contentScript.js"],
      target: {
        tabId: tabId,
      },
    },
    function (results) {}
  );
  // }
  // else {
  //     console.log('inject google.js')
  // }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (request.redirect == true) {

  //     if (request.url.indexOf('http') == -1)
  //         request.url = 'https://' + request.url;

  //     if (request.closeAfter == 'undefined')
  //         var closeAfter = true;
  //     else
  //         var closeAfter = request.closeAfter;

  //     if (request.move == 'undefined')
  //         var move = false;
  //     else
  //         var move = request.move;

  //     var opened = createTab(request.url, closeAfter, move);

  //     if (!opened)
  //         var creating = chrome.tabs.create({ 'url': request.url, selected: false });

  // }
  switch (request.code) {
    case 1:
      chrome.storage.sync.set({ shadow_root_id: request.shadowRootId });
      break;
    case 2:
      chrome.storage.sync.get("shadow_root_id");
      break;
    case 4:
        sendResponse(domainInfos.detailDomains.list[request.domain]);
      break;
    case 5: 
      storeInfo.loaded = Date.now(); 
      storeInfo.list = request.store; 
      break;
    case 6:
        sendResponse({ ...storeInfo }); 
      break;
    case 7:
      featureInfo.loaded = Date.now();
      featureInfo.list = request.feature;
      break;
    case 8:
      sendResponse({...featureInfo})
      break;
    case 9:
      languages[request.locale] = {...{translation: request.translation, loaded: Date.now()}}
      break;
    case 10:
      sendResponse({...languages[request.locale]})
      break;
  }
  setTimeout(()=>{ 
    return true; //to tell the content script to look out for sendResponse
  }, 1000)
});
