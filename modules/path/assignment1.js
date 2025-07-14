// showing sample file information

const path = require('path');
const file = path.join(__dirname, '01.js');

console.log('full Path: ', file);
console.log('File Name: ', path.basename(file));
console.log('Directory: ', path.dirname(file));
console.log('Extension: ', path.extname(file));
