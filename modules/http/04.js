const http = require('http');
const fs = require('fs')

const server = http.createServer((req, res)=>{
    if(req.url === '/'){
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('Welcome to the Home Page!');
    } else if (req.url === '/html'){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end('<h1 style = "color:blue;">Hello from HTML Page</h1>');
    } else if(req.url === '/json'){
        const data = {name: "Sanjay", course: "Node.js"};
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(data));
    } else if(req.url === '/file'){
        fs.readFile('sample.txt', 'utf8', (err, content)=>{
            if(err){
                res.writeHead(500, {'Content-Type':'text/plain'});
                return res.end('Error Handling the file');
            }
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end(content);
        }) 
    } else {
        res.writeHead(404, {'Content-Type':'text/plain'});
        res.end('404 - page not found');
    }
});

server.listen(3000, ()=>{
    console.log('server running');
})