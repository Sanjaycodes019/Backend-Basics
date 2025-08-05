// serving css file 
const http = require('http')
const fs = require('fs')
const path = require('path')

fs.writeFileSync('style.css', 'this is sample css');

http.createServer((req, res)=>{
    fs.readFile(path.join(__dirname, 'style.css'), (err, data)=>{
        if(err){
            res.writeHead(500);
            res.end('Error loading css file');
        } else {
            res.writeHead(200, {'Content-Type':'text/css'});
            res.end(data);
        }
    });
}).listen(3000);