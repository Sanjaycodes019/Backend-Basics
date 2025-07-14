const fs = require('fs');
const path = require('path');

const folder = 'documents';

if(fs.existsSync(folder)){
    const items = fs.readFileSync(folder, {withFileTypes:true});

    items.forEach(item=>{
        if(item.isFile()){
            console.log(item.name);
        }
    });
} else {
    console.log('documents/ folder not found');
}