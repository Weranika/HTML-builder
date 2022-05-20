const path = require('path');
const fs = require("fs");

const pathToFile = path.join(__dirname, "text.txt");
let readableStream = fs.createReadStream(pathToFile, "utf8");

readableStream.on("data", function(chunk){ 
    console.log(chunk);
});