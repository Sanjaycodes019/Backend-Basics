const http = require('http');

const server = http.createServer(function (req, res) {
  res.write('Welcome to My First Node.js Server');
  res.end();
});

server.listen(3000, function () {
  console.log('Server is running at http://localhost:3000');
});
