// used for creating server, handling request from browser 
// and sending back responses (like HTML, JSON, etc)

const http = require('http');

const server = http.createServer((req, res)=>{
    res.write('welcome to my first nodejs server');
    res.end();
});

server.listen(3000, ()=>{
    console.log("server running on the port 3000")
});