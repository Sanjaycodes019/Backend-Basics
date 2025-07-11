const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const { add, sub, mul, div } = require('./calculate');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile('./index.html', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  } else if (req.url.startsWith('/add') && req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const num1 = Number(url.searchParams.get('num1'));
    const num2 = Number(url.searchParams.get('num2'));

    if (isNaN(num1) || isNaN(num2)) {
      res.end('Error: Invalid input.');
    } else {
      res.end('Result: ' + add(num1, num2));
    }

  } else if (req.url.startsWith('/sub') && req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const num1 = Number(url.searchParams.get('num1'));
    const num2 = Number(url.searchParams.get('num2'));

    if (isNaN(num1) || isNaN(num2)) {
      res.end('Error: Invalid input.');
    } else {
      res.end('Result: ' + sub(num1, num2));
    }

  } else if (req.url === '/mul' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { num1, num2 } = qs.parse(body);
      const a = Number(num1), b = Number(num2);

      if (isNaN(a) || isNaN(b)) {
        res.end('Error: Invalid input.');
      } else {
        res.end('Result: ' + mul(a, b));
      }
    });

  } else if (req.url === '/div' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { num1, num2 } = qs.parse(body);
      const a = Number(num1), b = Number(num2);

      if (isNaN(a) || isNaN(b)) {
        res.end('Error: Invalid input.');
      } else {
        const result = div(a, b);
        res.end(typeof result === 'string' ? result : 'Result: ' + result);
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
