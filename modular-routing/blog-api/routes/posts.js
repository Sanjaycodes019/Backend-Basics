const express = require('express')
const router = express.Router()

// dummy post data
const posts = [
    {id: 1, title:'first post', content: 'this is the first blog post'},
    {id: 2, title:'second post', content: 'this is the second blog post'}
]

// get/post - all post
router.get('/posts', (req, res)=>{
    res.json(posts);
})

// get /posts/:postid - specific post
router.get('/posts/:postid', (req, res)=>{
    const postid = parseInt(req.params.postid);
    const post = posts.find(p=>p.id===postid);
    if(post){
        res.json(post);
    } else {
        res.status(404).json({message:'post not found'});
    }
});

module.exports = router;