// deleting a file

const fs = require('fs');
fs.unlinkSync('demo.txt');

fs.unlink('demo1.txt', (err)=>{
    if(!err) console.log('deleted demo1.txt');
});