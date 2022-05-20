const path = require('path');
const fs = require("fs");
const pathToFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFile, {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.filter(file => !file.isDirectory())
    .map(file => {
        const pathToFile = path.join(__dirname, 'secret-folder', `${file.name}`);
        const stats = fs.statSync(pathToFile);
        const  fileSizeInKb = stats.size / 1024;
        const fileName = file.name.split('.').join(' - ');
        const finalStr = fileName + ' - ' + fileSizeInKb + 'kb';
        return finalStr;
    })
    .forEach(finalStr => console.log(finalStr))
    });

