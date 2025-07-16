const express = require('express');
const app = expree();
const port = 3000;



app.listen(port, ()=>{
    console.log(`server started at port ${port}`);
})