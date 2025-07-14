// creating folders

const fs = require('fs');

fs.mkdirSync('test-folder'); //sync


// async
fs.mkdir('test-folder1', (err)=>{
    if(!err) console.log('folder created!');
});

// nested folder
fs.mkdir('test-folder/nested', {recursive:true}, (err)=>{})