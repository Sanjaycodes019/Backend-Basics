const http = require('http');
const url = require('url');

http.createServer((req, res) => {
  if (req.url.startsWith('/greet')) {
    const { lang } = url.parse(req.url, true).query;   // Direct destructure
    const msg = (lang === 'en') ? 'Hello' :
                (lang === 'fr') ? 'Bonjour' :
                (lang === 'hi') ? 'Namaste' :
                'Hello (Default)';

    res.end(msg);   // No need for writeHead separately (defaults to 200 OK)
  } else {
    res.end('Route not found');
  }
}).listen(3000, () => console.log('http://localhost:3000'));
