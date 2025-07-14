// copying from two files to a third file 

const fs = require('fs');

fs.readFile('a.txt', 'utf8', (err, data1) => {
    fs.readFile('b.txt', 'utf8', (err, data2)=>{
        const result = data1 +'\n' + data2;
        fs.writeFile('c.txt', result, (err)=>{
            if(!err) console.log("merged successfully!");
        });
    });
});