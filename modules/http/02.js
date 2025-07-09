// http server using expressJS

const express = require('express');
// const app = express();

// // Route for Home Page
// app.get('/', (req, res) => {
//   res.send('Welcome to Express.js Backend');
// });

// // Start server
// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

const app = express();
app.listen(3000, ()=>{
    console.log("server started...");
})

app.get("/", (req, res)=>{
    res.sendFile(__dirname, "/login.html");
})

app.post('/sendData', (req, res)=>{
    res. 
})