// reading from a file

const fs = require('fs');

//sync
const data = fs.readFileSync('demo.txt', 'utf-8');
console.log(data);

//async
fs.readFile('demo1.txt', 'utf-8', (err, data)=>{
    if(!err) console.log(data);
});

