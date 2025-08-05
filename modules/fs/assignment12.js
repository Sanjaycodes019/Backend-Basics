// count total number of files and folders

const fs = require('fs')
const path = require('path')

const dir = __dirname;
let filecount = 0;
let foldercount = 0;

fs.readdir(dir, (err, items)=>{
    if(err) return console.error(err);

    items.forEach(item=>{
        const itempath = path.join(dir, item);
        const stats = fs.statSync(itempath);

        if(stats.isFile()) filecount++;
        else if(stats.isDirectory()) foldercount++;
    });
    console.log(`total folder are ${foldercount}`);
    console.log(`total files are ${filecount}`);
})