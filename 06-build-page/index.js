const path = require('path');
const fs = require("fs");
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');
const pathToAssetsCopy = path.join(__dirname, 'project-dist', 'assets');

function projectDist() {
    creatDir(pathToProjectDist);
}

function creatDir(path) {
    console.log('create dir is called!');
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log(`Directory ${path} created successfully!`);
    });
}

function copyAssetsDir() {
    fs.access(pathToAssetsCopy, fs.F_OK, (err) => {
        if (err) {
            console.log('does not exist');
            creatDir(pathToAssetsCopy);            
        }

        fs.readdir(pathToAssetsCopy, (err, files) => {
            if (err) 
                console.log('can not read dir ');
    
            files.forEach((file) => {
                if (!path.extname(file)) {
                    return;
                }
    
                fs.unlink(path.join(pathToAssetsCopy, `${file}`), (err => {
                    if (err) 
                        console.log(`delet ${file}`);
                }));
            })
        })

        copy(); 
    })    
}

function copy() {
    console.log('copy function is called')
    fs.readdir(pathToAssets, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            console.log(1)
            if (!path.extname(file)) {
                return;
            }
            
            fs.copyFile(path.join(pathToAssets, `${file}`), path.join(pathToAssetsCopy, `${file}`), err => {
                console.log(2)
                if (err) {
                    console.error(err);
                }   
                console.log(`copied ${file} sucsees`);
            });
        });
    });
}


projectDist();
copyAssetsDir();