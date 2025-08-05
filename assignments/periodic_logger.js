const fs = require('fs')

function getFormattedTime(){
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

setInterval(() => {
    const timestamp = getFormattedTime();
    const logEntry = `log entry at ${timestamp}\n`;

    fs.appendFile('Logger.txt', logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        } else {
            console.log(`Logged: ${timestamp}`);
        }
    });
}, 3000);