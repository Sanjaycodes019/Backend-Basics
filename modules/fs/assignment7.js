// Scans myNotes/
// Filters only .txt files
// Creates backupNotes/ if it doesn't exist
// Copies only .txt files and shows success messages

const fs = require('fs');
const path = require('path');

// Define source and destination folders
const sourceFolder = path.join(__dirname, 'myNotes');
const backupFolder = path.join(__dirname, 'backupNotes');

// Step 1: Create backup folder if it doesn't exist
if (!fs.existsSync(backupFolder)) {
  fs.mkdirSync(backupFolder);
}

// Step 2: Read all items in myNotes/
const items = fs.readdirSync(sourceFolder);

// Step 3: Loop through each item
items.forEach(item => {
  const srcPath = path.join(sourceFolder, item);
  const destPath = path.join(backupFolder, item);
  const stats = fs.statSync(srcPath);

  // Check if it's a file and ends with .txt
  if (stats.isFile() && item.endsWith('.txt')) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied: ${item}`);
  }
});
