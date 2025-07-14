// serving a html file
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res)=>{
    if(req.url === '/home'){
        fs.readFile('index.html', (err, data)=>{
            res.writeHead(200, {"content-type":'text/html'});
            res.end(data);
        }); 
    } else {
        res.end('404 - page not found')
    }
});

server.listen(3000);