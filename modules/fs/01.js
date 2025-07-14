// fs module provide api to interact with file system
// reading, writing, creating, deleting files and directories
// synchronous(blocking) - easy to read and understand
// asynchronous(non-blocking) - better performance, real-world usage

// writing to a file

// importing the fs module
 const fs = require('fs');
 const fsPromises = require('fs').promises;

 // writing to a file
 // sync version
 fs.writeFileSync('demo.txt', 'hello from node!');

 // async version
 fs.writeFile('demo1.txt', 'hello from nodejs(async)', (err)=>{
    if(!err) console.log('file written sucessully!');
 });

 // promise version
 async function writeFile(){
    await fsPromises.writeFile('demo3.txt', 'hello from fs promises');
    console.log('done form promise!')
 }
 writeFile();