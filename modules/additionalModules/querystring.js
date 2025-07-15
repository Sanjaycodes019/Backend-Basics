const qs = require('querystring');
const data = 'name=sanjay&age=21';
const parsed = qs.parse(data);
console.log(parsed.name);