const path = require('path');
const fs = require("fs");
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const pathToFile = path.join(__dirname, "text.txt");
const rl = readline.createInterface({ input, output });

console.log('\nHello!');

const recursiveAsyncReadLine = function () {
    rl.question('\nAre you still here? \n', (answer) => {    
    if (answer === 'exit') {        
        process.exit();
        console.log(`Bye-bye`);
    } 
    fs.appendFile(pathToFile, `${answer}\n`,  err => {
            if(err) {
                throw err;
            }
        })
        recursiveAsyncReadLine();
    });    
}
recursiveAsyncReadLine();

process.on('exit', (code) => {
    console.log(`Bye-bye`);
});
