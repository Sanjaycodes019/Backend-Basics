const express = require('express')
const session = require('express-session')
const app = express()

// middleware for session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 6000}
}))

// route to set session data
app.get('/login', (req, res)=>{
    req.session.username = "Sanjay"
    res.send("Session is set!")
})

// route to access session data
app.get('/dashboard', (req ,res)=>{
    if(req.session.username){
        res.send(`welcome back, ${req.session.username}`) 
    } else {
        res.send("Please login first!")
    }
})

// destroy session
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.send('logged out and session destroyed')
    })
})

app.listen(3000, ()=>{
    console.log('server running on port 3000')
})

