const fs = require('fs')
const folderPath = __dirname;

fs.readdir(folderPath, (err, files)=>{
    if(err) return console.error('error fetching files: ', err);
    console.log('files in current folder are: ', files);
    // returns in form of array
});


// check if folder exists
if(fs.existsSync(folderPath)){
    console.log('yes exists');
} else {
    console.log('no it doesnt exists');
}

// creating a folder
fs.mkdir('myfolder', (err)=>{
    if(err) return console.error('error creating the folder', err);
    else console.log('myfolder created successfully');
})

// reading the content of folder
fs.readdir(folderPath, (err, files)=>{
    if(err) return console.error(err);
    console.log('files inside this path are: ', files);
})

// deleting a folder(works for empty folders only)
fs.rmdir(folderPath, (err)=>{
    if(err) return console.err('cannot delete the folder', err);
    console.log('folder deleted mentioned in the path')
});

// for non empty folders
fs.rm('myfolder', {recursive: true}, (err)=>{
    if(err) throw err;
    console.log('folder and its contents are deleted sucessully');
})


// renaming a folder
fs.rename('myfolder', 'renamed_folder', (err)=>{
    if(err) throw err;
    console.log('folder renamed');
})