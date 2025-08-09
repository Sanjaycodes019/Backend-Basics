const express = require('express')
const router = express.Router()

const comments = [
    {id:1, postid: 1, text:'Nice post'},
    {id:2, postid: 2, text:'Thanks for sharing'},
    {id:3, postid: 3, text:'Interesting read'}
];

// get/comments - all comments
router.get('/comments', (req, res)=>{
    res.json(comments);
});

// get /comments/:commentid - specific comment
router.get('/comments/:commentid', (req, res)=>{
    const commentid = parseInt(req.params.commentid);
    const comment = comments.findIndex(c=>c.id===commentid);
    if(comment){
        res.json(comment);
    } else {
        res.status(404).json({message: "Comment not found"})
    }
});

module.exports = router;