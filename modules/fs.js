// reading file sync
const fs = require('fs');
console.log('first');
const file = fs.readFileSync('file.txt', 'utf-8');
console.log(file);

console.log('second')

// reading file async
fs.readFile('file.txt','utf-8', (err, data)=>{
    if(err){
        console.log(err);
    } else {
        console.log(data);
    }
});
console.log('third');

// writing file (creating)
fs.writeFileSync('./greet.txt','Hello world');


fs.writeFile('./greet.txt', 'Hello Sanjay', (err)=>{
    if(!err){
        console.log('file logged!')
    }
})