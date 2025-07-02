// sync code

const fs = require('fs');

const f1 = fs.readFileSync('greet.txt', 'utf-8');

const f2 = fs.readFileSync('file.txt', 'utf-8');

const finalContent = f1 +'\n'+ f2;

fs.writeFileSync('thirdfile.txt', finalContent);

console.log('copying successful!');
