import {
  focused,
  genericOnClick,
  linstenOninstalled,
} from "./context_menu/context_menu.js";
import { Timer } from "./model/timer.js";

chrome.contextMenus.onClicked.addListener(genericOnClick);
linstenOninstalled();
//變數
let currentTabId = null; // 存儲當前活動的 tab 的 ID
let port = null;
let timer = new Timer(0);
let focusGroup = [];
//defineProperty
Object.defineProperty(chrome.windows, "focused", {
  get: getFocused,
  set: setMyVariable,
});
function getFocused() {
  return focused;
}

function setMyVariable(value) {
  console.log(currentTabId);
  focusGroup.push(currentTabId);
  chrome.tabs.group({ tabIds: focusGroup }, function (group) {
    // 將分頁加入群組
    chrome.tabGroups.update(group, { title: "Focus group" });
  });
  timer.stopTimer();
}

// 監聽 active tab 切換事件
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    currentTabId = tab.id;

    if (focusGroup.length !== 0 && !focusGroup.includes(tab.id)) {
      //如果先前已建立連接，要斷開
      if (port) {
        port.disconnect();
        timer.startTimer(connectToCurrentTab);
      }
      timer.startTimer(connectToCurrentTab);
      port = chrome.tabs.connect(tab.id);
    } else if (focusGroup.length !== 0 && focusGroup.includes(tab.id)) {
      timer.resetTime();
      timer.stopTimer();
    }
  });
});

// 建立連結後的開始跑回圈
function connectToCurrentTab() {
  timer.plusTime();
  if (port && port.sender && port.sender.tab) {
    port.postMessage({ msg: timer.getTime });
  } else {
    port = chrome.tabs.connect(currentTabId);
    port.postMessage({ msg: timer.getTime });
  }
}

// 當tab跳轉到網頁時開始計時
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  currentTabId = tabId;
  if (port) {
    port.disconnect();
    timer.stopTimer();
  }

  switch (changeInfo.status) {
    case "complete":
      console.log("conmplete");
      if (focusGroup.length !== 0 && !focusGroup.includes(tab.id)) {
        //如果先前已建立連接，要斷開
        if (port) {
          port.disconnect();
        }
        port = chrome.tabs.connect(tab.id);
        timer.startTimer(connectToCurrentTab);
      }
    default:
      break;
  }
});
// 當tab關閉且在focusgroup裡
chrome.tabs.onRemoved.addListener(function (id, removeInfo) {
  const elementToRemove = id;
  const index = focusGroup.indexOf(elementToRemove);
  if (index !== -1) {
    focusGroup.splice(index, 1);
  }
});


