import { TabInfo } from "../model/tabInfo.js";
console.log("popup.js");
let tabList = [];
const key = "timerStatus";
setPlayIcon();

// 在 popup.js 中建立與 background.js 的連接
chrome.runtime.onConnect.addListener(function (port) {
  console.log("Connected to background.js");
  // 接收來自 background.js 的訊息
  port.onMessage.addListener(function (msg) {
    console.log("Message received from background.js: ");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 嘗試建立與 background.js 的連線
  var port = chrome.runtime.connect({ name: "communication" });
  console.log("Connected to background.js");

  // 接收來自 background.js 的訊息
  port.onMessage.addListener(function (message) {
    // 做一些處理...
    // 回傳訊息給 background.js
    let timer = document.querySelector(".timer");
    // 将时间字符串转换为秒数
    const seconds = parseInt(message.message, 10);
    // 计算分钟和秒钟
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    // 格式化时间为 "00:00" 形式
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    timer.textContent = formattedTime;
  });

  // 彈出式視窗關閉時處理連接的斷開
  window.addEventListener("beforeunload", function () {
    console.log("Popup window closed");
    port.disconnect(); // 手動斷開連接
  });
});

chrome.tabGroups.query(
  { title: "Focus group", color: "pink" },
  function (group) {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      const id = group[0].id;
      tabs.forEach(function (tab) {
        if (tab.groupId === id) {
          var title = tab.title;
          var favicon = tab.favIconUrl;
          let tabInfo = new TabInfo(title, favicon);
          tabList.push(tabInfo);
        }
      });

      let list = document.querySelector(".tab_list");
      for (var i = 0; i < tabList.length; i++) {
        let li = document.createElement("li");
        let image = document.createElement("img");
        image.setAttribute("src", tabList[i].favicon);
        image.setAttribute("class", "tab_icon");
        image.setAttribute("width", "32px");
        image.setAttribute("height", "32px");

        li.appendChild(image);
        var p = document.createElement("p");
        li.appendChild(p);
        if (tabList[i].title.length > 10) {
        }
        p.textContent = tabList[i].title;
        list.append(li);
      }
    });
  }
);

chrome.storage.sync.get(key, function (result) {
  let status = null;
  let playIcon = document.querySelector("#play_icon");
  status = result[key];
  result[key] === true
    ? (playIcon.src = "../images/stop.png")
    : (playIcon.src = "../images/play.png");

  console.log(result[key], "我看看情況");
});

function setPlayIcon() {
  let playIcon = document.querySelector("#play_icon");
  playIcon.addEventListener("click", function (event) {
    chrome.storage.sync.get(key, function (result) {
      let status = result[key]; // 获取最新的存储值
      chrome.storage.sync.set({ [key]: !status }).then(function () {
        console.log("Value updated successfully");
        status = !status;
        console.log(status);
        if (status === true) {
          playIcon.src = "../images/stop.png";
        } else {
          playIcon.src = "../images/play.png";
        }
      });
    });
  });
}

//監聽改變的部分
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
