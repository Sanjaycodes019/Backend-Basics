const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res)=>{
    //serve only files from /public/
    if(req.url.startsWith('/public')){
        const filepath = path.join(__dirname, req.url)
        fs.readFile(filepath, (err, data)=>{
            if(err) {
                res.writeHead(404, {'content-type':'text/plain'})
                res.end('404 - not found')
                return
            }

            const ext = path.extname(filepath);
            let contentType = 'text/plain';
            if(ext === '.css') contentType = 'text/css';
            if(ext === '.js') contentType = 'application/js';
            if(ext === '.png') contentType = 'image/png';
            if(ext === '.jpg'||ext ==='.jpeg') contentType = 'image/jpeg';
            if(ext === '/html') contentType = 'text/html';

            res.writeHead(200, {'content-type':contentType});
            res.end(data);
        }) 
    } else {
        res.writeHead(404, {'content-type':'text/plain'})
        res.end('404 - not found')
    }
})

server.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})