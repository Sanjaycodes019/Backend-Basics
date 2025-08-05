// serving a js file

// jsServer.js
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, '09.js'), (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading JS file');
        } else {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        }
    });
}).listen(3000, () => console.log(' JS Server running at http://localhost:3000'));
