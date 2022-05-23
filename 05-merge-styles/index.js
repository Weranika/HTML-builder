
const path = require('path');
const fs = require("fs");
const util = require('util');

const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, function(err, data){
            if (err) 
                reject(err); 
            else 
                resolve(data);
        });
    });
};

const readDir = util.promisify(fs.readdir);
// function readDir(path) {
//     return new Promise((resolve, reject) => {
//         fs.readdir(path,  {withFileTypes: true}, function(err, data){
//             if (err) 
//                 reject(err); 
//             else 
//                 resolve(data);
//         });
//     });
// };

async function createBundle() {
    let dirs = await readDir(path.join(__dirname, 'styles'),  {withFileTypes: true})
    //let dirs = await readDir(path.join(__dirname, 'styles'));
    console.log(dirs);
    const files = dirs.map(direntFile => direntFile.name)
    .filter(filename => filename.includes('css'))
    .map(filename => readFile(path.join(__dirname, 'styles', filename)));

    const filesContentsArr = await Promise.all(files);

    const bundle = fs.createWriteStream(pathToBundle);
    bundle.write(filesContentsArr.join('\n'));
    bundle.end();
    
    
    // Promise.all(files).then(values => {
    //     const bundle = fs.createWriteStream(pathToBundle);
    //     bundle.write(values.join('\n'));
    //     bundle.end();
    // })
    
}



createBundle();