const http = require('http')
const url = require('url')

const server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type':'text/html'})

    const parsedurl = url.parse(req.url, true);
    const query = parsedurl.query;

    const name = query.name || 'Guest';
    const age = query.age || 'unknown';

    res.end(`<h1>hello ${name}</h1><p>your age is ${age}</p>`);
})

server.listen(3000, ()=>{
    console.log('server started');
})

