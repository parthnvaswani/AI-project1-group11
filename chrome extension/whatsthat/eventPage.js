//add listener for activating popup of extension when user is on web.whatsapp.com
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting
      .insertCSS({
        target: { tabId: tabId },
        files: ["./content/content.css"],
      })
      .then(() => {
        console.log("INJECTED THE FOREGROUND STYLES.");

        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: [
              "./content/curseWords.js",
              "./content/slangs.js",
              "./content/compromise-tokenize.js",
              "./content/fuse.js",
              "./content/content.js",
            ],
          })
          .then(() => {
            console.log("INJECTED THE FOREGROUND SCRIPT.");
          });
      })
      .catch((err) => console.log(err));
  }
});
