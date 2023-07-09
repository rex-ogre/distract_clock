
console.log("popup.js")

// 在 popup.js 中建立與 background.js 的連接
chrome.runtime.onConnect.addListener(function(port) {
    console.log("Connected to background.js");
  
    // 接收來自 background.js 的訊息
    port.onMessage.addListener(function(msg) {
      console.log("Message received from background.js: ");
    });
  });