const { log } = require('console');
const fs = require('fs');
const path = require('path');

const logfile = path.join(__dirname, 'activity.log');

function getCurrentTime(){
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19);
}

function logTime(){
    const entry = `log entry at ${getCurrentTime()}\n`;
    fs.appendFile(logfile, entry, (err)=>{
        if(!err){
            console.log('logged: ', entry.trim());
        }
    });
}

setInterval(logTime, 5000);

logTime();