// 1. Importing required modules
const http = require('http');  // Module to create HTTP server
const fs = require('fs');      // Module to interact with the file system

// 2. Create the server
const server = http.createServer((request, response) => {

  // 3. Handling Home Page (Root route: "/")
  if (request.url == "/") {
    response.write("Home page");  // Sends "Home page" message
    response.end();                // Ends the response
  }

  // 4. Handling Login Page (/login)
  else if (request.url == "/login") {
    fs.readFile('./login.html', 'utf-8', (err, data) => {
      if (err) {
        response.write("Error reading file");
        response.end();
        return;
      }
      response.writeHead(200, { 'Content-Type': 'text/html' });  // Set content-type as HTML
      response.write(data);  // Sends the content of the login.html file
      response.end();        // Ends the response
    });
  }

  // 5. Handling Image Route (/image)
  else if (request.url == "/image") {
    fs.readFile('./test.png', (err, data) => {
      if (err) {
        response.write("Error reading image");
        response.end();
        return;
      }
      response.writeHead(200, { 'Content-Type': 'image/png' });  // Set content-type as PNG image
      response.write(data);  // Sends the image data
      response.end();        // Ends the response
    });
  }

  // 6. Default: 404 Not Found
  else {
    response.write("404 Not found");  // Sends error message if route doesn't match
    response.end();                   // Ends the response
  }
});

// 7. Start the server
server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
