const fs = require('fs');
const path = __dirname;

fs.stat(path, (err, stats) => {
    if (err) throw err;
    // console.log(stats);
});

/*
stats.size	        Size of the file in bytes	1024
stats.isFile()	    Returns true if it’s a file	true
stats.isDirectory()	Returns true if it’s a folder	false
*/

// checking file type

fs.stat(path, (err, stats)=>{
    if(err) return console.error(err);

    if(stats.isFile()){
        console.log('this is a file');
    } else {
        console.log('this is a directory');
    }
})


// statsync for simplicity
const stats = fs.statSync('demo3.txt');
console.log(`file size: ${stats.size} bytes`);
console.log(`created: ${stats.birthtime}`);
console.log(`modified: ${stats.mtime}`);
