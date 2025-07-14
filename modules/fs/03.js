// appending to a file

const fs = require('fs');

// sync
fs.appendFileSync('demo.txt','\n new text added');

// async
fs.appendFile('demo1.txt', '\n new line added', (err)=>{
    if(!err) console.log('appended!');
});