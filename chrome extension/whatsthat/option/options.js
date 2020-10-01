// function to switch tabs
function openTab(e) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(e.target.dataset["word"]).style.display = "block";
  e.currentTarget.className += " active";
}
// add openTab listener to tab links
document.querySelectorAll(".tablinks").forEach((e) => {
  e.addEventListener("click", openTab);
});

//adding curse word on form submit
document.querySelector("#curseform").addEventListener("submit", (e) => {
  e.preventDefault();
  let word = document.querySelector('input[id="word"]').value;
  document.querySelector('input[id="word"]').value = "";
  chrome.storage.local.get("curse", function (result) {
    let json;
    if (result["curse"]) {
      json = JSON.parse(result["curse"]);
      json.words.push(word);
    } else {
      json = { words: [word] };
    }
    chrome.storage.local.set({ curse: JSON.stringify(json) });
    location.reload();
  });
});

//adding slang word on form submit
document.querySelector("#slangform").addEventListener("submit", (e) => {
  e.preventDefault();
  let word = document.querySelector('input[id="sword"]').value;
  let meaning = document.querySelector('input[id="mword"]').value;
  document.querySelector('input[id="sword"]').value = "";
  document.querySelector('input[id="mword"]').value = "";
  chrome.storage.local.get("slang", function (result) {
    let json;
    if (result["slang"]) {
      json = JSON.parse(result["slang"]);
      json.words[word] = meaning;
    } else {
      json = { words: { [word]: meaning } };
    }
    chrome.storage.local.set({ slang: JSON.stringify(json) });
    location.reload();
  });
});

//removing all slang words on button click
document.querySelector("#ras").addEventListener("click", (e) => {
  chrome.storage.local.remove("slang", function (result) {
    location.reload();
  });
});
//removing all curse words on button click
document.querySelector("#rac").addEventListener("click", (e) => {
  chrome.storage.local.remove("curse", function (result) {
    location.reload();
  });
});

//fill the dropdown list with currently added curse and slang words
window.onload = () => {
  fill();
};
function fill() {
  chrome.storage.local.get("curse", function (result) {
    if (result["curse"]) {
      let json = JSON.parse(result["curse"]);
      let html = "",
        i = 0;
      json.words.forEach((e) => {
        html += `<option value="${i}">
                ${e}
              </option>`;
        i++;
      });
      document.querySelector("#cselect").innerHTML += html;
    }
  });
  chrome.storage.local.get("slang", function (result) {
    if (result["slang"]) {
      let json = JSON.parse(result["slang"]);
      let html = "";
      for (const key in json.words) {
        html += `<option value="${key}">
                ${key}->${json.words[key]}
              </option>`;
      }
      document.querySelector("#sselect").innerHTML += html;
    }
  });
}

// remove selected curse word on form submit
document.querySelector("#rcurseform").addEventListener("submit", (e) => {
  e.preventDefault();
  let idx = document.querySelector('select[id="cselect"]').value;
  chrome.storage.local.get("curse", function (result) {
    let json = JSON.parse(result["curse"]);
    json.words.splice(idx, 1);
    chrome.storage.local.set({ curse: JSON.stringify(json) });
    document.querySelector(`option[value="${idx}"]`).remove();
  });
});
// remove selected slang word on form submit
document.querySelector("#rslangform").addEventListener("submit", (e) => {
  e.preventDefault();
  let key = document.querySelector('select[id="sselect"]').value;
  chrome.storage.local.get("slang", function (result) {
    let json = JSON.parse(result["slang"]);
    delete json.words[key];
    chrome.storage.local.set({ slang: JSON.stringify(json) });
    document.querySelector(`option[value="${key}"]`).remove();
  });
});
