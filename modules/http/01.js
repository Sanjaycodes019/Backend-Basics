const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log('Requested URL:', req.url, 'Method:', req.method);

    if (req.url === '/login' && req.method === 'GET') {
        // Serve login.html page
        fs.readFile('./login.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/login' && req.method === 'POST') {
        // Handle form submission
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = querystring.parse(body);
            console.log('Received login data:', formData);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Hello, ${formData.username}! You have logged in successfully.`);
        });
    } else {
        // Route not found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});