const http = require('http')

http.createServer((req, res)=>{
    if(req.url === '/hello'){
        res.writeHead(200, {'content-type':'text/plain'});
        res.end('Hello User')
    } else if(req.url === '/about'){
        res.writeHead(200, {'content-type':'text/plain'});
        res.end('About Page')
    } else {
        res.writeHead(404, {'content-type':'text/plain'});
        res.end('404 - Route error');
    }
}).listen(3000)