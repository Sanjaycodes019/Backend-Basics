// const http = require('http');
// const url = require('url');

// http.createServer((req, res) => {
  
//   // Check if the route starts with /greet
//   if (req.url.startsWith('/greet')) {
    
//     // Parse query parameters
//     const queryObject = url.parse(req.url, true).query;
//     const lang = queryObject.lang;

//     // Decide message based on lang
//     let msg;
//     if (lang === 'en') {
//       msg = 'Hello';
//     } else if (lang === 'fr') {
//       msg = 'Bonjour';
//     } else if (lang === 'hi') {
//       msg = 'Namaste';
//     } else {
//       msg = 'Hello (Default)';
//     }

//     // Send the message as response
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end(msg);

//   } else {
//     // For any other route
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Route not found');
//   }

// }).listen(3000, () => {
//   console.log('Server running at http://localhost:3000');
// });


const http = require('http')
const url = require('url')

const server = http.createServer((req, res)=>{
  if(req.url.startsWith('/greet')){
    const queryObject = url.parse(req.url, true).query;
    const lang = queryObject.lang;
    let result;
    if(lang === 'en'){
      result = 'Hello';
    } else if(lang === 'fr'){
      result = 'Bonjour';
    } else if(lang === 'hi'){
      result = 'Namaste';
    } else {
      result = 'Hello(default)';
    }

    res.writeHead(200, {'content-type':'text/plain'});
    res.end(result);
  } else {
    res.writeHead(404, {'content-type':'text/plain'});
    res.end('Error Route');
  }
})

server.listen(3000);