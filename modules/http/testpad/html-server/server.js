const http = require('http');
const fs = require('fs');

const server = http.createServer(function (req, res) {
  if (req.url === '/home') {
    fs.readFile('index.html', function (err, data) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
      }
      res.end();
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 - Page Not Found');
    res.end();
  }
});

server.listen(3000, function () {
  console.log('Server running at http://localhost:3000');
});
