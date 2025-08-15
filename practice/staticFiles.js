// Static files are files that do not change while server is running
// html, css, js, images, fonts, pdfs, etc
// in Express, express.static() middleware is used to serve these files

// app.use(express.static('public'));

const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
    console.log(__dirname)
})

app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000')
})