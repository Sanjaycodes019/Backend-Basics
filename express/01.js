// basic code

const express = require('express');
const app = express();

// basic route
app.get('/', (req, res)=>{
    res.send('hello from express!');
})

// start the server
app.listen(3000, ()=>{
    console.log('server is running on the port http://localhost:3000');
});