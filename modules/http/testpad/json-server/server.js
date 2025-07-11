const http = require('http');

const server = http.createServer(function (req, res) {
  if (req.url === '/api/user') {
    const user = {
      name: 'John Doe',
      age: 30,
      profession: 'Developer'
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(user));
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 - Page Not Found');
    res.end();
  }
});

server.listen(3000, function () {
  console.log('Server running at http://localhost:3000');
});
