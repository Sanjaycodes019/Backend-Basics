// to extract query parameters or pathname of url

const url = require('url');

const parsed = url.parse('http://localhost:3000/user?id=5&name=sanjay', true);
console.log(parsed.query.name); // sanjay


