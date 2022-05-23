const path = require('path');
const fs = require("fs");
const util = require("util");

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');
const pathToAssetsCopy = path.join(__dirname, 'project-dist', 'assets');
const pathToTemplateHtml = path.join(__dirname, 'template.html');
const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const copyfile = util.promisify(fs.readdir);
const makeDir = util.promisify(fs.mkdir);

function main() {
    createDir(pathToProjectDist);
    createIndex();
    createBundle(); 
    copy(path.join(__dirname, 'assets'), pathToAssetsCopy);
}

async function createDir(path) {
    console.log('create dir is called!', path);
    await makeDir(path, { recursive: true });

    console.log(`Directory ${path} created successfully!`);

}

async function createIndex() {
    let indexHtml = await readFile(pathToTemplateHtml, 'utf-8');
    let startInd = indexHtml.indexOf('{{');
    while (startInd > 0) {
        const finishInd = indexHtml.indexOf('}}', startInd);
        const tagName = indexHtml.substring(startInd+2, finishInd);
        console.log(tagName);

        const pathToComponent = path.join(__dirname, 'components', tagName + '.html' );
        const componentContent = await readFile(pathToComponent, 'utf-8');
        indexHtml = indexHtml.replace(`{{${tagName}}}`, componentContent);
        startInd = indexHtml.indexOf('{{', finishInd);        
    }
    await writeFile(path.join(__dirname, 'project-dist', 'index.html'), indexHtml);
}

async function createBundle() {
    let dirs = await readDir(path.join(__dirname, 'styles'),  {withFileTypes: true}); 
    const files = dirs.map(direntFile => direntFile.name)
    .filter(filename => filename.includes('css'))
    .map(filename => readFile(path.join(__dirname, 'styles', filename)));

    const filesContentsArr = await Promise.all(files);

    const bundle = fs.createWriteStream(pathToBundle);
    bundle.write(filesContentsArr.join('\n'));
    bundle.end();
}

function copyAssetsDir(pathToAssetsCopy) {
    fs.access(pathToAssetsCopy, fs.F_OK, (err) => {
        if (err) {
            console.log('does not exist');
            createDir(pathToAssetsCopy);            
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
                        console.log(`delete ${file}`);
                }));
            })
        })
        copy(); 
    })    
}

async function copy(from, to) {
    console.log('copy function is called', from, to);
    const filesInDir = await readDir(from);

    for (let i = 0; i < filesInDir.length; i++){
        const file = filesInDir[i];
        if (!path.extname(file)){
            console.log("creation directory ",file)
            await createDir(path.join(to, file));
            copy(path.join(from, file), path.join(to, file));
            continue;
        }

        console.log('copying file', from, file);       
        path.dirname
        fs.copyFile(path.join(from, file), path.join(to, file), err => 
        {
            if (err) {
                console.error(err);
            }   
            console.log(`copied ${file} sucsees`);
        });
    }
}

main();