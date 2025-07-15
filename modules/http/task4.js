// shows simple html form to submit feedback (GET/)
// stores feedback in memory (POST/ feedback)
// Displays all feedbacks (GET/ Feedback)

const http = require('http');
const fs = require('fs');
const qs = require('querystring');

let feedbacks = [];

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile('index1.html', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  } else if (req.url === '/feedback' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const parsed = qs.parse(body);
      feedbacks.push(parsed);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Feedback received. Thank you!');
    });

  } else if (req.url === '/feedbacks' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(feedbacks));
  
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
