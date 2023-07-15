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
let contentPort = null;
let popPort = null;
let popTimeInterval = null;
let timer = new Timer(0);
let focusGroup = [];
const key = "timerStatus";
let phase1 = false;
let phase2 = false;
let phase3 = false;
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
    chrome.tabGroups.update(group, { title: "Focus group", color: "pink" });
  });
  timer.stopTimer();
}

// 監聽 active tab 切換事件
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    currentTabId = tab.id;

    if (focusGroup.length !== 0 && !focusGroup.includes(tab.id)) {
      //如果先前已建立連接，要斷開
      if (contentPort) {
        contentPort.disconnect();
        timer.startTimer(connectToCurrentTab);
      }
      timer.startTimer(connectToCurrentTab);
      contentPort = chrome.tabs.connect(tab.id);
    } else if (focusGroup.length !== 0 && focusGroup.includes(tab.id)) {
      timer.resetTime();
      timer.stopTimer();
    }
  });
});

// 建立連結後的開始跑回圈
function connectToCurrentTab() {
  chrome.storage.sync.get(key, function (result) {
    if (result[key] === true) {
      timer.plusTime();
      if (contentPort && contentPort.sender && contentPort.sender.tab) {
        contentPort.postMessage({ msg: timer.time });
      } else {
        contentPort = chrome.tabs.connect(currentTabId);
        contentPort.postMessage({ msg: timer.time });
      }
      //跳通知
      if (timer.time > 300 && phase1 === false) {
        phase1 = true;
        let options = {
          type: "basic",
          title: "Basic Notification",
          message: "你分心了5分鐘",
          iconUrl: "../images/stop.png ",
        };
        chrome.notifications.create(options);
      }
      //phase 2
      if (timer.time > 600 && phase2 === false) {
        phase2 = true;
        let options = {
          type: "basic",
          title: "Basic Notification",
          message: "你分心了10分鐘",
          iconUrl: "../images/stop.png ",
        };
        chrome.notifications.create(options);
      }
      //phase3
      if (timer.time > 900 && phase3 === false) {
        phase3 = true;
        let options = {
          type: "basic",
          title: "Basic Notification",
          message: "你分心了15分鐘",
          iconUrl: "../images/stop.png ",
        };
        chrome.notifications.create(options);
      }
    }
  });
}

// 當tab跳轉到網頁時開始計時
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  currentTabId = tabId;
  if (contentPort) {
    contentPort.disconnect();
    timer.stopTimer();
  }

  switch (changeInfo.status) {
    case "complete":
      console.log("conmplete");
      if (focusGroup.length !== 0 && !focusGroup.includes(tab.id)) {
        //如果先前已建立連接，要斷開
        if (contentPort) {
          contentPort.disconnect();
        }
        contentPort = chrome.tabs.connect(tab.id);
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

chrome.runtime.onConnect.addListener(function (port) {
  popPort = port;

  function sendTime() {
    popPort.postMessage({ message: timer.time });
  }
  popTimeInterval = setInterval(sendTime, 1000);
  popPort.onMessage.addListener(function (message) {
    // 做一些處理...
    // 回傳訊息給彈出式視窗
  });

  // 彈出式視窗斷開連接時處理
  port.onDisconnect.addListener(function () {
    clearInterval(popTimeInterval);
    popTimeInterval = null;
    // 做一些處理...
  });
});

// 先检查之前是否已经设置过相同的键
chrome.storage.sync.get(key, function (result) {
  if (result[key] !== undefined) {
    // 键已经存在，进行相应的处理
    console.log("Key already exists:", key, result[key]);
  } else {
    // 键不存在，可以设置新值
    chrome.storage.sync.set({ [key]: true }, function () {
      console.log("Value set for key:", key);
    });
  }
});
