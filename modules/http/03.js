// // serving a html file 

// const fs = require('fs')
// const http = require('http')
// const path = require('path')

// const server = http.createServer((req, res)=>{
//     if(req.url === '/'){
//         fs.readFile(path.join(__dirname, 'index.html'), (err, data)=>{
//             res.writeHead(200, {'Content-Type':'text/html'});
//             res.end(data);
//         });
//     }
// });

// server.listen(3000);



const http = require('http')

const server = http.createServer((req, res)=>{
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(`<h1>hello world</h1>`);
});

server.listen(3000, ()=>{
    console.log('server started')
})