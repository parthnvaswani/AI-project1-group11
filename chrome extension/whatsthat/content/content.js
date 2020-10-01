//define global variables
let str, regex, slangKeys, fuse, options;
//make a string of curse words for regex
chrome.storage.local.get("curse", function (result) {
  if (result["curse"]) {
    let json = JSON.parse(result["curse"]);

    curseWords = [...curseWords, ...json.words];
  }
  str = curseWords.join("|").replace(/[-\/\\^$*+?.()[\]{}]/g, "\\$&");

  regex = new RegExp(str, "gi");
});
//create a dictionary and array to match and get meanings of slang words from
chrome.storage.local.get("slang", function (result) {
  if (result["slang"]) {
    let json = JSON.parse(result["slang"]);

    slangs = { ...slangs, ...json.words };
  }

  slangKeys = Object.keys(slangs);

  //set options for search
  options = {
    includeScore: true, //score of matching will be included
    minMatchCharLength: 2, //minimum number of characters should match to be in the final list
    distance: 0, //distance from location(default 0) till where the match could be found
  };
  //create a object with options and keys to search from
  fuse = new Fuse(slangKeys, options);
});

//create a button
let button = document.createElement("button");
//make it draggable
button.setAttribute("draggable", "true");
//add some styling for positioning it
button.style.top = "91.5vh";
button.style.left = "88vw";
button.innerText = "filter";
button.classList.add("filterText");
//track the dragstart event and make the button's opacity 0.1
button.addEventListener("dragstart", (e) => {
  e.target.style.opacity = "0.1";
});
//track the dragend event and set the position of button at the position of cursor at that time
button.addEventListener("dragend", (e) => {
  e.target.style.top = e.y + "px";
  e.target.style.left = e.x + "px";
  e.target.style.opacity = "1";
  e.target.style.transform = "translate(-50%,-50%)";
});
//add click listener on button to filter and refine the text in text box
button.addEventListener("click", () => {
  //get the text from the text box
  let textbox = document.querySelectorAll(
    '._3FRCZ.copyable-text.selectable-text[contenteditable="true"]'
  )[1];
  //if text box is not present return
  if (!textbox) return;
  //sete text box text in message variable
  let message = textbox.innerText;
  let words = [];
  //tokenize by words
  nlp
    .tokenize(message)
    .out("tags")
    .forEach((e) => Object.keys(e).forEach((j) => words.push(j)));

  //refine the text
  let content = words.map((e) => {
    //search the match
    let result = fuse.search(e);
    //if match exists and score is less than 0.34 return the full form of matched word
    if (result.length > 0 && result[0].score <= 0.34) {
      return slangs[result[0].item];
    }

    //else return the original word
    return e;
  });

  //now filter out curse words using regex from the refined string
  let filtered = content.join(" ").replace(regex, "***");
  //set the newly formed string in text box text
  textbox.innerText = filtered;
});
//append the button after 8 seconds of page load
setTimeout(() => {
  document.body.appendChild(button);
}, 8000);

//send message to background page for activating the popup on web.whatsapp.com
chrome.runtime.sendMessage({ todo: "showPageAction" });

//listen for messages from popup page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //if the message is filterContent
  if (request.todo == "filterContent") {
    //select all the message currently present in the chat
    document
      .querySelectorAll(
        "span._3Whw5.selectable-text:not(.matched-mention)>span:not(._5h6Y_):not(._3Whw5)"
      )
      .forEach((e) => {
        //if the message is not a link
        if (!e.querySelector("a")) {
          //get it's text content
          let message = e.textContent;
          //replace the curse words with *** if it has any
          let filtered = message.replace(regex, "***");
          //set back the new string
          e.textContent = filtered;
        }
      });
  }
  //else if the message is refineContent
  else if (request.todo == "refineContent") {
    //select all the message currently present in the chat
    document
      .querySelectorAll(
        "span._3Whw5.selectable-text:not(.matched-mention)>span:not(._5h6Y_)"
      )
      .forEach((e) => {
        //if the message is not a link
        if (!e.querySelector("a")) {
          //tokenize the string into words
          let words = [];
          nlp
            .tokenize(e.textContent)
            .out("tags")
            .forEach((e) => Object.keys(e).forEach((j) => words.push(j)));

          //refine the text
          let content = words.map((e) => {
            //search the match
            let result = fuse.search(e);
            //if match exists and score is less than 0.34 return the full form of matched word
            if (result.length > 0 && result[0].score <= 0.34) {
              return slangs[result[0].item];
            }
            //else return the original word
            return e;
          });

          //set the final string in place of original messages
          e.textContent = content.join(" ");
        }
      });
  }
});
