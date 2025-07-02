const fs = require('fs');

// Step 1: Append data
fs.appendFile('./file.txt', 'i am studying backend\n', (err) => {
  if (err) {
    console.log('Error while appending:', err);
  } else {
    console.log('Content appended successfully!');

    // Step 2: Read the updated content
    fs.readFile('./file.txt', 'utf8', (err, data) => {
      if (err) {
        console.log('Error while reading:', err);
      } else {
        console.log('\n📄 Full File Content:\n' + data);
      }
    });
  }
});
