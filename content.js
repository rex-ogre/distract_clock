console.log("content.js");
let phase1 = false;
let phase2 = false;
let phase3 = false;
//append html tag
function append_bubble(className, content) {
  if (phase1 === false) {
    phase1 = true;
  }

  const bubble_body = document.createElement("div");
  bubble_body.setAttribute("class", "bubble_body");
  const bubble = document.createElement("div");
  bubble.setAttribute("class", "bubble right");
  const ptag = document.createElement("p");
  ptag.setAttribute("class", className);
  ptag.textContent = content;

  bubble_body.appendChild(bubble);
  bubble.appendChild(ptag);
  document.body.appendChild(bubble_body);
}

function append_bubble2(className, content) {
  if (phase2 === false) {
    phase2 = true;
  }
  const bubble_body = document.querySelector(".bubble_body");
  const bubble = document.createElement("div");
  bubble.setAttribute("class", "bubble right");
  const ptag = document.createElement("p");
  ptag.setAttribute("class", className);
  ptag.textContent = content;
  bubble.appendChild(ptag);
  bubble_body.appendChild(bubble);
}

function append_bubble3(className, content) {
  if (phase3 === false) {
    phase3 = true;
  }
  const bubble_body = document.querySelector(".bubble_body");
  const bubble = document.createElement("div");
  bubble.setAttribute("class", "bubble right");
  const ptag = document.createElement("p");
  ptag.setAttribute("class", className);
  ptag.textContent = content;
  bubble.appendChild(ptag);
  bubble_body.appendChild(bubble);
}

//監聽來自background的訊息
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (response) {
    console.log("我收到了");
    console.log(response.msg);
    //phase 1
    if (response.msg > 300) {
      if (phase1 === false) {
        append_bubble("content", "You are getting distract");
      }
    }
    //phase 2
    if (response.msg > 600) {
      if (phase2 === false) {
        append_bubble2("content", "You really getting distract");
      }
    }
    //phase3
    if (response.msg > 900) {
      if (phase3 === false) {
        append_bubble3("content", "幹 你要分心多久");
      }
    }
  });
});
