const express = require('express')
const router = express.Router()

router.get('/login', (req, res)=>{
    res.send('students login page served...')
})

module.exports = router