const os = require("os");
const path = require("path");
const fs = require("fs");

console.log("===== OS MODULE =====");

console.log("Operating System:", os.platform());
console.log("OS Type:", os.type());
console.log("CPU Architecture:", os.arch());
console.log("Number of CPUs:", os.cpus().length);

console.log("\n===== PATH MODULE =====");

let filePath = path.join("documents", "student", "data.txt");

console.log("File Path:", filePath);
console.log("File Name:", path.basename(filePath));
console.log("Extension:", path.extname(filePath));
console.log("Directory:", path.dirname(filePath));

console.log("\n===== FS MODULE =====");

let fileName = "sample.txt";
let content = "This file is created using the Node.js fs module.";

fs.writeFileSync(fileName, content);

console.log("File created successfully.");

let data = fs.readFileSync(fileName, "utf8");

console.log("File Content:", data);

fs.appendFileSync(fileName, "\nThis is additional content.");

console.log("Content appended successfully.");

let finalData = fs.readFileSync(fileName, "utf8");

console.log("Final File Content:");
console.log(finalData);