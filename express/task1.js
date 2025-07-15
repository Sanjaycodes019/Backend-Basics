// basic logger middleware
// log every incoming request's method and path

const express = require('express');
const path = require('path');
const app = express();

// custom middleware function
function logger(req, res, next){
    console.log(`${req.method} ${req.url}`);
    next(); // go to next middleware or route
}

// use the middleware
app.use(logger);

// a simple route
app.get('/', (req, res)=>{
    res.send('Home Page');
});

app.get('/About', (req, res)=>{
    res.send('About Page');
});

app.listen(3000, ()=>{
    console.log('server started on port 3000');
})