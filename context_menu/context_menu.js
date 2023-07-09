export var focused = false;

// A generic onclick callback function.
export function genericOnClick(info) {
  switch (info.menuItemId) {
    case "focus":
      // Radio item function
      console.log("Radio item clicked. Status:", info.checked);
      focused = info.checked;
      chrome.windows.focused = focused;
      break;
    default:
      // Standard context menu item function
      console.log("Standard context menu item clicked.");
  }
}
export function linstenOninstalled() {
  chrome.runtime.onInstalled.addListener(function () {
    // Create a radio item.
    chrome.contextMenus.create({
      title: "Focus on this tab",
      type: "normal",
      contexts: ["all"],
      id: "focus",
    });
  });
}
