const path = require('path');
const fs = require("fs");
const pathToFiles = path.join(__dirname, 'files');
const pathToFilesCopy = path.join(__dirname, 'files-copy');

function copyDir() {
    fs.access(pathToFilesCopy, fs.F_OK, (err) => {
        if (err) {
            console.log('does not exist');
            creatDir();            
        }

        fs.readdir(pathToFilesCopy, (err, files) => {
            if (err) 
                console.log('can not read dir ');
    
            files.forEach((file) => {
                if (!path.extname(file)) {
                    return;
                }
    
                fs.unlink(path.join(pathToFilesCopy, `${file}`), (err => {
                    if (err) 
                        console.log(`delet ${file}`);
                }));
            })
        })

        copy(); 
    })    
}

function creatDir() {
    console.log('create dir is called!');
    fs.mkdir(pathToFilesCopy, { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    });
}

function copy() {
    fs.readdir(pathToFiles, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            if (!path.extname(file)) {
                return;
            }
            
            fs.copyFile(path.join(pathToFiles, `${file}`), path.join(pathToFilesCopy, `${file}`), err => {
                if (err) {
                    console.error(err);
                }   
                console.log(`copied ${file} sucsees`);
            });
        });
    });
}

copyDir();