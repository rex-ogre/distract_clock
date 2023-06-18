// 在 background.js 中
//變數
var currentTabId = null; // 存儲當前活動的 tab 的 ID
let timer = 0
let port = null;
let intervalID = null
var hasTimerStart = false

// 監聽 active tab 切換事件
chrome.tabs.onActivated.addListener(function(activeInfo) {
  
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    let url = tab.url;
    console.log("當前標籤頁的 URL：" + tab.url);

    timer = 0
    //如果先前已建立連接，要斷開
    if (currentTabId) {
      hasTimerStart = false
      port.disconnect()
      clearInterval(intervalID)
    }
  
    if (url.startsWith("https") || url.startsWith("http")) {
      intervalID = setInterval(connectToCurrentTab, 1000);
      currentTabId = activeInfo.tabId;
      port = chrome.tabs.connect(currentTabId);
      console.log(currentTabId)
    }
  });
});

// 建立連結後的開始跑回圈
function connectToCurrentTab() {
    hasTimerStart = true
    timer += 1
    port.postMessage({msg:timer})
  
}




//以上為要用的code 勿刪
//測試 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {  
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
});

