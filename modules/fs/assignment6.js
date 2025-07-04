const fs = require('fs');

const sourcePath ='./activity.pdf';
const destinationPath = './activity1.pdf';

fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
        console.error('Error copying file:', err);
    } else {
        console.log('File copied successfully!');
    }
});