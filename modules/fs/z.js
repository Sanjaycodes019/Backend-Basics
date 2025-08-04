const fs = require('fs');

fs.writeFileSync('timestamp.txt', ''); // Create empty file
let count = 0;

const timer = setInterval(() => {
    count++;
    const time = new Date().toString();

    // Append timestamp (synchronous for simplicity)
    fs.appendFileSync('timestamp.txt', `log ${count}: ${time}\n`);
    console.log(`Timestamp ${count} added`);

    if (count === 5) {
        clearInterval(timer);

        // Read file synchronously
        const data = fs.readFileSync('timestamp.txt', 'utf-8');
        console.log('\nFile content:\n', data);

        // Rename file
        fs.renameSync('timestamp.txt', 'final_timestamp.txt');
        console.log("File renamed to final_timestamp.txt");
    }
}, 5000);
