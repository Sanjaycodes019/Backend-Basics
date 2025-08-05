const { clear } = require('console');
const fs = require('fs');
const timestamp = new Date().toString();

fs.writeFileSync('file1.txt', 'hi');
fs.writeFileSync('file2.txt', 'hello');

fs.readFile('file1.txt', 'utf-8', (err, data1)=>{
    if(err) return console.error('error reading file1.txt', err);

    fs.readFile('file2.txt', 'utf-8', (err, data2)=>{
        if(err) return console.error('error reading file2.txt', err);

        const mergetContent = `==== merge log: ${timestamp} ==== \n${data1}\n${data2}`;

        fs.writeFile('merged.txt', mergetContent, (err)=>{
            if(err) return console.error("error writing the file", err);

            fs.renameSync('merged.txt', 'final.txt');
            fs.unlinkSync('file1.txt');
            fs.unlinkSync('file2.txt');
        })
    })
})