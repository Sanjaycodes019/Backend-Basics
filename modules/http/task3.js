// handle post request and recieve json data in node.js(http module)

const http = require('http');

const server = http.createServer((req, res)=>{
    if(req.url === '/submit' && req.method === 'POST'){
        let body = '';

        req.on('data', chunk =>{
            body += chunk;
        });

        req.on('end', () => {
            const parsedData = JSON.parse(body);
            const username = parsedData.username;

            res.writeHead(200, {"content-type":'text/plain'});
            res.end(`recieved data for user: ${username}`);
        });
    } else {
        res.writeHead(404, {"content-type":'text/plain'});
        res.end('404-page not found');
    }
});

server.listen(3000, () => {
    console.log('server listening...')
});