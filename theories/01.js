// dynamic routing with multiple params
// url = /user/:uid/order/:oid
// http://localhost:3000/user/101/order/5001

// const express = require('express');
// const app = express();
// const PORT = 3000;

// app.get('/user/:uid/order/:oid', (req, res) => {
//     const userId = req.params.uid;
//     const orderId = req.params.oid;

//     res.send(`User ID: ${userId}, Order ID: ${orderId}`);
// });

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });



// serving static files using 

const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, 'home.html'))
})

app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname, 'about.html'))
})

app.get('/contact', (req, res)=>{
    res.sendFile(path.join(__dirname, 'contact.html'))
})

app.listen(port, ()=>{
    console.log('server running on the port 3000')
})