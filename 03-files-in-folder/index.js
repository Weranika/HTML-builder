const path = require('path');
const fs = require("fs");
const util = require('util');
const pathToFile = path.join(__dirname, 'secret-folder');
const fileNamesArr = [];

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

async function statOfFolder() {
    const files = await readdir(pathToFile, {withFileTypes: true});

    const filteredFiles = files.filter(file => !file.isDirectory()).map(dirrent => dirrent.name)
                            .map(filename => {
                                fileNamesArr.push(filename);
                                return path.join(__dirname, 'secret-folder', filename);
                                })
                            .map(path => stat(path));

    const statistics = await Promise.all(filteredFiles);
    for (let i = 0; i < statistics.length; i++) {
        const  fileSizeInKb = statistics[i].size / 1024;
        const fileName = fileNamesArr[i].split('.').join(' - ');
        const finalStr = fileName + ' - ' + fileSizeInKb + 'kb';
        console.log(finalStr);
    }
}

statOfFolder();