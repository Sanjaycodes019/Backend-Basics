// handling basic routes

const http = require('http');

const server = http.createServer((req, res)=>{
    if(req.url === '/'){
        res.end('Home Page');
    } else if (req.url === '/about'){
        res.end('About Us Page');
    } else {
        res.statusCode = 404;
        res.end('404-page not found');
    }
});

server.listen(3000, ()=>{
    console.log('server running... ');
});