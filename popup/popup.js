import { TabInfo } from "../model/tabInfo.js";
console.log("popup.js")
let tabList = [];




// 在 popup.js 中建立與 background.js 的連接
chrome.runtime.onConnect.addListener(function(port) {
    console.log("Connected to background.js");
  
    // 接收來自 background.js 的訊息
    port.onMessage.addListener(function(msg) {
      console.log("Message received from background.js: ");
    });
  });



  document.addEventListener('DOMContentLoaded', function() {
    // 嘗試建立與 background.js 的連線
    var port = chrome.runtime.connect({ name: "communication" });
    console.log("Connected to background.js");
  
    // 接收來自 background.js 的訊息
    port.onMessage.addListener(function(message) {
      console.log("Message received from background.js: ", message);
  
      // 做一些處理...
  
      // 回傳訊息給 background.js
      port.postMessage({ message: "Response from popup.js" });
    });
  
    // 彈出式視窗關閉時處理連接的斷開
    window.addEventListener('beforeunload', function() {
      console.log("Popup window closed");
      port.disconnect(); // 手動斷開連接
    });
  });
  

  // chrome.tabs.query({currentWindow: true}, function(tabs) {

    chrome.tabGroups.query({ title: "Focus group",color: "pink" }, function(group){
      chrome.tabs.query({currentWindow: true}, function(tabs) {
      const id = group[0].id
      tabs.forEach(function(tab) {
        if (tab.groupId === id) {
        var title = tab.title;
        var favicon = tab.favIconUrl;
        let tabInfo = new TabInfo(title,favicon)
        console.log("我看看favicon",favicon)
        tabList.push(tabInfo)
        }
      })
      
          let list = document.querySelector(".tab_list")
          for (var i = 0; i < tabList.length; i++) {
            var li = document.createElement("li");
            var image = document.createElement("img");
            image.setAttribute('src', tabList[i].favicon);
            image.setAttribute('class','tab_icon');
            image.setAttribute('width',"32px")
            image.setAttribute('height',"32px")
            li.appendChild(image);
            var p = document.createElement("p");
            li.appendChild(p)
            p.textContent = tabList[i].title;
            list.append(li)
          }
      
      });
    })

  