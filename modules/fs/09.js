const fs = require('fs');
const path = require('path');

const currentFolder = __dirname;
console.log(`working inside: ${currentFolder}\n`);

fs.readdir(currentFolder, (err, items)=>{
    if(err) return console.error('Error reading the folder', err);

    console.log('All items inside current folder are: ');
    items.forEach(item=> console.log(`-${item}\n`));
})