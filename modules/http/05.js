const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  if (req.url === '/') {
    res.end('<h1>Welcome to the Home Page</h1>');

  } else if (req.url === '/about') {
    res.end('<h1>About Us</h1><p>This is the about page.</p>');

  } else if (req.url === '/contact') {
    res.end('<h1>Contact Us</h1><p>Email: contact@example.com</p>');

  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }

});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
