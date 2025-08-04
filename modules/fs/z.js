const fs = require('fs');

fs.writeFileSync('log.txt', '');

let count = 0;

const timer = setInterval(() => {
    count++;
    const time = new Date().toLocaleTimeString();

    fs.appendFileSync('log.txt', `log${count}: ${time}\n`);
    console.log(`log ${count} written`);

    if(count===3){
        clearInterval(timer);
        const data = fs.readFileSync('log.txt', 'utf8');
        console.log('\n final data: \n', data);
    }
}, 2000);