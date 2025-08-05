const fs = require('fs');
const path = require('path');

const dir = __dirname; // current directory
let largestfile = {name: '', size: 0};

fs.readdir(dir, (err, files)=>{
    if(err) return console.error(err);

    files.forEach(file=>{
        const filepath = path.join(dir, file);
        const stats = fs.statSync(filepath);

        if(stats.isFile()&& stats.size>largestfile.size){
            largestfile = {name: file, size: stats.size};
        }
    });
    console.log(`largest file is: ${largestfile.name} of size ${largestfile.size} `);
});