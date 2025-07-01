const fs = require('fs');
const file = fs.readFileSync('file.txt', 'utf-8');
console.log(file);