// Scans myNotes/
// Filters only .txt files
// Creates backupNotes/ if it doesn't exist
// Copies only .txt files and shows success messages
const fs = require('fs');

const source = __dirname + '/myNotes';
const backup = __dirname + '/backupNotes';

if (!fs.existsSync(backup)) {
  fs.mkdirSync(backup);
}

const files = fs.readdirSync(source);

for (let i = 0; i < files.length; i++) {
  let file = files[i];
  let srcPath = source + '/' + file;
  let stat = fs.statSync(srcPath);

  if (stat.isFile() && file.endsWith('.txt')) {
    let destPath = backup + '/' + file;
    fs.copyFileSync(srcPath, destPath);
    console.log('Copied: ' + file);
  }
}
