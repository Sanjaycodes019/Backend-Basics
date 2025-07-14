// reading folder content

const fs = require('fs');

const files = fs.readdirSync('./'); // array of files and folders
// console.log(files);


fs.rmdirSync('test-folder'); // sync


// async method to delete folder
fs.rmdir('test-folder1', (err)=>{
    if(!err) console.log('folder deleted!');
});

// check if exits

if(fs.existsSync('demo.txt')){
    console.log('file exists')
}