// Create a Node server which:
// Logs Request URL & Method in the console.
// If the method is GET, respond with "You sent a GET request".
// If the method is POST, respond with "You sent a POST request".
// For other methods, respond with "Unsupported Method".

const http = require('http')

http.createServer((req, res)=>{
    if(req.method==='GET'){
        res.writeHead(200, {'content-type':'text/plain'});
        res.end('You send a GET request');
    } else if(req.method==='POST'){
        res.writeHead(200, {'content-type':'text/plain'});
        res.end('You send a POST request');
    } else {
        res.writeHead(404, {'content-type':'text/plain'});
        res.end('Unsupported Method');
    }
}).listen(3000)


