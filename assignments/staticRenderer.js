// const express = require('express')
// const path = require('path')
// const app = express()

// app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res)=>{
//     res.sendFile(path.join(__dirname, 'index.html'))
// })

// app.listen(3000, ()=>{
//     console.log('server running on the port 3000')
// })



// if its said don't use express.static
// we have to serve is manually

const express = require('express')
const path = require('path')
const { runInNewContext } = require('vm')
const app = express()

// serve html manually
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

// serve css manually
app.get('/style.css', (req, res)=>{
    res.sendFile(path.join(__dirname, 'style.css'))
})

// serve js manually
app.get('/script.js', (req, res)=>{
    res.sendFile(path.join(__dirname, 'script.js'))
})

app.listen(3000, ()=>{
    console.log('sever running on the port 3000')
})

// note
// res.sendFile() works for any file type — HTML, CSS, JS, image, PDF, etc.
// You just need to give the correct absolute path using path.join() and __dirname.

