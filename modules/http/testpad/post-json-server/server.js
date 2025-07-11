const http = require('http');

const server = http.createServer(function (req, res) {
  if (req.url === '/submit' && req.method === 'POST') {
    let body = '';

    req.on('data', function (chunk) {
      body += chunk;
    });

    req.on('end', function () {
      const data = JSON.parse(body);
      const username = data.username || 'unknown';
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Received data for user: ' + username);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page Not Found');
  }
});

server.listen(3000, function () {
  console.log('Server running at http://localhost:3000');
});
