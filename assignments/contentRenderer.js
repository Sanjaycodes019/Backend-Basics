const express = require('express')
const path = require('path')
const app = express()

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, 'home.html'))
})

app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname, 'about.html'))
})

app.get('/contact', (req, res)=>{
    res.sendFile(path.join(__dirname, 'contact.html'))
})

app.listen(3000, ()=>{
    console.log('app running on the server')
})