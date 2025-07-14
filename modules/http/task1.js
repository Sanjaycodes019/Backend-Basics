// handling different routes

const http = require('http');

const server = http.createServer((req, res) => {
  // Set response header
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Route handling
  if (req.url === '/') {
    res.end('Home Page');
  } else if (req.url === '/about') {
    res.end('About Page');
  } else if (req.url === '/contact') {
    res.end('Contact Page');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page Not Found');
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
