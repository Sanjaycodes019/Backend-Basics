const http = require('http');
const fs = require('fs');
const querystring = require('querystring'); // To parse form data

const server = http.createServer((req, res) => {
    if (req.url === '/login' && req.method === 'GET') {
        // Serve login HTML page
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
            // You can implement login validation here

            // Send a response back
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Hello, ${formData.username}! You have logged in successfully.`);
        });
    } else {
        // Handle other routes or methods
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});