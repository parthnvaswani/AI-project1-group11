//send message to content script to filter chat on button click
document.querySelector("#filter").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "filterContent",
    });
  });
});

//send message to content script to refine chat on button click
document.querySelector("#refine").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "refineContent",
    });
  });
});
