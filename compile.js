//import file system module
const fs = require("fs");

//read json data from file and parse it to javascript object and store it in a variable.
let obj1 = JSON.parse(fs.readFileSync("./slangs.json"));

//convert all the keys to lowercase
let key,
  keys = Object.keys(obj1);
let n = keys.length;
let newobj = {};
while (n--) {
  key = keys[n];
  newobj[key.toLowerCase()] = obj1[key].toLowerCase();
}

//read and store other two files
let obj2 = JSON.parse(fs.readFileSync("./slangs2.json"));
let obj3 = JSON.parse(fs.readFileSync("./slangs3.json"));

//spread all the objects into one
let obj = { ...obj3, ...obj2, ...newobj };

//store the final object in a file
fs.writeFileSync("./finalSlang.json", JSON.stringify(obj));
