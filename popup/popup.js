
console.log("popup.js")

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
  