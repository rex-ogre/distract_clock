import {focused, genericOnClick, linstenOninstalled}from './script/context_menu.js';

chrome.contextMenus.onClicked.addListener(genericOnClick);
linstenOninstalled();
//變數
let focusTabId = null
let currentTabId = null // 存儲當前活動的 tab 的 ID
let timer = 0
let port = null
let intervalID = null
let hasTimerStart = false

Object.defineProperty(chrome.windows, 'focused', {
  get: getFocused,
  set: setMyVariable
});
function getFocused() {
  return focused;
}

function setMyVariable(value) {
  if (value === false) {
    focusTabId = null
    clearInterval(intervalID)
  } else {
    focusTabId = currentTabId
  }
}

// 監聽 active tab 切換事件
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    let url = tab.url;
    if (url.startsWith("https") || url.startsWith("http")) {
      currentTabId = tab.id;
    }
    console.log("focusTabId: ",focusTabId)
    console.log("tab.id: ",tab.id)
    switch (focusTabId) {
      case null:
        break
      case tab.id:
        break
      default:
        let url = tab.url;
        console.log("當前標籤頁的 URL：" + tab.url);
        timer = 0
        //如果先前已建立連接，要斷開
        if (currentTabId && port) {
          hasTimerStart = false
          port.disconnect()
          clearInterval(intervalID)
        }
        if (url.startsWith("https") || url.startsWith("http")) {
          if (hasTimerStart === false) {
            intervalID = setInterval(connectToCurrentTab, 1000);
            currentTabId = activeInfo.tabId;
            port = chrome.tabs.connect(currentTabId);
            console.log(currentTabId)
          }
        }
    }
  });
});

// 建立連結後的開始跑回圈
function connectToCurrentTab() {
    hasTimerStart = true
    timer += 1
    port.postMessage({msg:timer})
  
}

// 當tab跳轉到網頁時開始計時
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {  
  if (tab.url.startsWith("https") || tab.url.startsWith("http")) {
    currentTabId = tabId;
  }
  console.log("focusTabId: ",focusTabId)
  console.log("tabId",tabId)
  switch (focusTabId) {
    case null:
      break
    case tabId:
      break
    default:
      if (currentTabId != tabId) {
        currentTabId = tabId
        timer = 0
        if (currentTabId && port) {
          port.disconnect()
          hasTimerStart = false
          clearInterval(intervalID)
        }
    }

    if (tab.url.startsWith("https") || tab.url.startsWith("http")) {
      switch (changeInfo.status) {
        case "complete":
            console.log("conmplete")
            if (hasTimerStart === false) {
            intervalID = setInterval(connectToCurrentTab, 1000);
            }
          currentTabId = tabId;
          port = chrome.tabs.connect(currentTabId);
        default:
          break
      }  
    }
  }
    
});

