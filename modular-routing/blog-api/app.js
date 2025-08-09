const express = require('express')
const app = express()

// import routes
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')

// mount routes under /api
app.use('/api', postRoutes)
app.use('/api', commentRoutes)

app.listen(3000, ()=>{
    console.log('Server running on http://localhost:3000')
})