const fs = require('fs')

// write to a file
fs.writeFile('today.txt', 'learning fs module', (err)=>{
    if(err) throw err;
    console.log('file created and data written')

    fs.appendFile('today.txt', ' and it is easy', (err)=>{
        if(err) throw err
        console.log('data appended')

        fs.readFile('today.txt', 'utf-8', (err, data)=>{
            if(err) throw err;
            console.log('file content', data);

            fs.renameSync('today.txt', 'journal.txt', (err)=>{
                if(err) throw err;
                console.log('file renamed to journal.txt')

                const stats = fs.statSync('journal.txt')
                console.log(stats.size);

                fs.unlink('journal.txt', (err)=>{
                    if(err) throw err;
                    console.log('file deleted successfully')
                })
            })
        })
    })
})