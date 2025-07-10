const express = require('express');
const app = express();

app.use(express.urlencoded())

app.get("/", (req, res)=>{
    // res.sendFile(__dirname, "/login.html")
    // res.send({"Name": "Sanjay Gupta"});
    // res.json({"Name":"Sneha"});
    // res.status(200).send({"Sanjay":"Gupta"});
})

app.listen(3000, ()=>{
    console.log("server started...")
})