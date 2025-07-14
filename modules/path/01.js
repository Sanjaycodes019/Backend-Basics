// manage file path, especially important when working aross different OS
// Makes code clean, portable and reliable

// loading the module
const path = require('path');

// join multiple path segments
const filePath = path.join('modules', 'path', '01.js');
// console.log(filePath);

// absolute path
const absolutePath = path.resolve('01.js');
// console.log(absolutePath);

// path basename
const fullPath = '/workspaces/Backend-Basics/modules/path/01.js';
console.log(path.basename(fullPath));
console.log(path.dirname(fullPath));
console.log(path.extname(fullPath));


// __dirname and __filename
console.log(__dirname); // shows entire path
console.log(__filename); // shows entire path with filename