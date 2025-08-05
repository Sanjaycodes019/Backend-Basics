const fs = require('fs')
const path = require('path')

const paths = path.join('__dirname', 'assignments');

fs.readdir(paths, (err, files) => {
    if (err) return console.error(err);
    console.log("📂 Files in folder:", files);
});
