const mongoose = require('mongoose');

// Connect
mongoose.connect('mongodb://localhost:27017/demo');

// ================= RELATIONSHIPS =================

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

// Post Schema with Reference to User
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    // Reference to User (One-to-Many)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

// Comment Schema with References
const commentSchema = new mongoose.Schema({
    text: String,
    // Reference to Post
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    // Reference to User
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// ================= CRUD WITH RELATIONSHIPS =================

// Create User and Post
async function createData() {
    // Create user
    const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com'
    });
    console.log('User created:', user._id);
    
    // Create post with user reference
    const post = await Post.create({
        title: 'My First Post',
        content: 'This is the content',
        author: user._id,  // Reference to user
        tags: ['mongodb', 'mongoose']
    });
    console.log('Post created:', post._id);
    
    // Create comment
    const comment = await Comment.create({
        text: 'Great post!',
        post: post._id,
        author: user._id
    });
    console.log('Comment created');
}

// ================= POPULATE (JOIN) =================

// Find posts with author details
async function findPostsWithAuthors() {
    const posts = await Post.find()
        .populate('author', 'name email')  // Populate author, select fields
        .sort({ createdAt: -1 });
    
    console.log('Posts with authors:');
    posts.forEach(post => {
        console.log(`- ${post.title} by ${post.author?.name}`);
    });
}

// Find post with comments
async function findPostWithComments() {
    const post = await Post.findOne({ title: 'My First Post' });
    
    const comments = await Comment.find({ post: post._id })
        .populate('author', 'name');
    
    console.log('Comments:');
    comments.forEach(c => {
        console.log(`- "${c.text}" by ${c.author?.name}`);
    });
}

// Deep populate (nested references)
async function deepPopulate() {
    const comments = await Comment.find()
        .populate({
            path: 'post',
            populate: {
                path: 'author',
                model: 'User'
            }
        })
        .populate('author', 'name');
    
    console.log('Deep populated:');
    comments.forEach(c => {
        console.log(`Comment on "${c.post?.title}" by ${c.post?.author?.name}`);
    });
}

// ================= VIRTUALS =================

// Add virtual field (not stored in DB)
postSchema.virtual('summary').get(function() {
    return this.content?.substring(0, 50) + '...';
});

// ================= AGGREGATION =================

// Count posts by author
async function countPostsByAuthor() {
    const result = await Post.aggregate([
        {
            $group: {
                _id: '$author',
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'authorInfo'
            }
        }
    ]);
    
    console.log('Posts per author:', result);
}

// createData();
// findPostsWithAuthors();
// findPostWithComments();
// countPostsByAuthor();

module.exports = { User, Post, Comment };
