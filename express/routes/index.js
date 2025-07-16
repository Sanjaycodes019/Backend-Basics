const express = require("express")
const path = require('path')
const app = express()
const baseRoute = require("./baseRoute")
const studentRoute = require('./student')
const teacherRoute = require('./teacher')


app.use("/", baseRoute)

app.use('/student', studentRoute)
app.use('/teacher', teacherRoute)

app.listen(3000, ()=>{
    console.log('server started....')
})
