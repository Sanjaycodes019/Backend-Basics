// routing in http module

const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    if (req.url === '/') {
        res.end('Welcome to Home Page');
    } else if (req.url === '/about') {
        res.end('About Us Page');
    } else if (req.url === '/contact') {
        res.end('Contact Us Page');
    } else {
        res.end('404 not found')
    }
});

server.listen(3000, () => console.log("Server running at http://localhost:3000"));
