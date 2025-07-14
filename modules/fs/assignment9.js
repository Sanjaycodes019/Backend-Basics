// Copy Only .txt Files from One Folder to Another

const fs = require('fs');
const path = require('path');

const source = 'myNotes';
const destination = 'backupNotes';

// create destination if it doesn't exists
if(!fs.existsSync(destination)){
    fs.mkdir(destination);
}

// read all items
const files = fs.readFileSync(source);

// loop and copy only .txt file

files.forEach(file=>{
    if(file.endsWith('.txt')){
        fs.copyFileSync(path.join(source, file), path.join(destination, file));
        console.log(`copied: ${file}`);
    }
});