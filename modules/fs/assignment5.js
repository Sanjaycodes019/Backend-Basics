// runs continuously and logs the current timestamp to a file named activity.log every 2 seconds

// const fs = require('fs');
// const logFile = 'activity.log';
// function logTimestamp() {
//     const timestamp = new Date().toLocaleString();
//     console.log(timestamp);
//     fs.appendFile(logFile, `${timestamp} \n`, (err) => {
//         if (err) {
//             console.error('Error writing to log file:', err); 
//         }
//     });
// }

// setInterval(logTimestamp, 1000);


const fs = require('fs');
const logFile = 'activity.txt';
function logTimestamp(){
    const timestamp = new Date().toLocaleString();
    console.log(timestamp);
    fs.appendFile(logFile, `${timestamp}\n`, (err)=>{
        if(err){
            console.error('error writing file', err);
        }
    })
}
setInterval(logTimestamp,1000)