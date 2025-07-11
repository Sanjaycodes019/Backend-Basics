const http = require('http');

const server = http.createServer(function (req, res) {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Home Page');
  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('About Us Page');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 - Page Not Found');
  }
  res.end();
});

server.listen(3000, function () {
  console.log('Server is running at http://localhost:3000');
});
