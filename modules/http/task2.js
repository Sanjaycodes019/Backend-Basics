// json response using http module

const http = require('http');

const server = http.createServer((req, res)=>{
    if(req.url === '/'){
        const user = {
            name: 'Sanjay Gupta',
            age: 21,
            profession: 'Developer'
        };

        res.writeHead(200, {"content-type":'application/json'});
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, {"content-type":'text/plain'});
        res.end('404 - page not found');
    }
});
 
server.listen(3000, ()=>{
    console.log("server started");
})