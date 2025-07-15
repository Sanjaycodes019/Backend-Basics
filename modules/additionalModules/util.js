// provides helpers like promisify to convert callback-based code into promise-based code

const { setFips } = require('crypto');
const fs = require('fs');
const util = util.promisify(fs.readFile);

const readFile = util.promisify(fs.readFile);
readFile('file.txt', 'utf8').then(console.log);