const express = require('express')
const router = express.Router()

router.get('/login', (req, res)=>{
    res.send('teachers login page served...')
})

module.exports = router