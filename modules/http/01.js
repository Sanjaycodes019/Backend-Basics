const http = require('http');
const fs = require('fs')
const server = http.createServer((req, res)=>{
    if(req.url == '/login' && req.method == 'GET'){
        fs.readFile('./login.html', (err, data)=>{
            if(!err){
                Response.writeHead(200, {'Content-type':'text/html'});
                res.write(data);
                res.end();
            }
        }) 
    } 
    else if(req.url == '/login' && req.method == "POST"){
        console.log("here");
    }
});

server.listen(3000, ()=>{
    console.log('server started...')
});