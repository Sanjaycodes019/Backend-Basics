const mongoose = require('mongoose');

// Connect
mongoose.connect('mongodb://localhost:27017/demo');

// ================= COMPLETE EXAMPLE =================
// Full-featured User & Post API with all patterns

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    lastLogin: Date
}, { timestamps: true });  // Adds createdAt & updatedAt

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    likes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    // Hash password before saving (pseudo-code)
    // if (this.isModified('password')) {
    //     this.password = hash(this.password);
    // }
    next();
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// ================= USER SERVICE =================

const UserService = {
    
    // Create user
    async create(userData) {
        return await User.create(userData);
    },
    
    // Get all with pagination
    async getAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find()
                .skip(skip)
                .limit(limit)
                .select('-password')
                .sort({ createdAt: -1 }),
            User.countDocuments()
        ]);
        
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },
    
    // Get by ID
    async getById(id) {
        return await User.findById(id).select('-password');
    },
    
    // Update
    async update(id, data) {
        return await User.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password');
    },
    
    // Delete
    async delete(id) {
        // Delete user's posts first
        await Post.deleteMany({ author: id });
        return await User.findByIdAndDelete(id);
    },
    
    // Search
    async search(query) {
        return await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');
    }
};

// ================= POST SERVICE =================

const PostService = {
    
    async create(postData) {
        return await Post.create(postData);
    },
    
    async getAll(filters = {}) {
        let query = Post.find();
        
        if (filters.author) {
            query = query.where('author', filters.author);
        }
        if (filters.published) {
            query = query.where('isPublished', true);
        }
        if (filters.tag) {
            query = query.where('tags').in([filters.tag]);
        }
        
        return await query
            .populate('author', 'name email')
            .sort({ createdAt: -1 });
    },
    
    async getById(id) {
        return await Post.findById(id)
            .populate('author', 'name email');
    },
    
    async likePost(id) {
        return await Post.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true }
        );
    },
    
    async publish(id) {
        return await Post.findByIdAndUpdate(
            id,
            { $set: { isPublished: true } },
            { new: true }
        );
    }
};

// ================= EXPRESS ROUTES EXAMPLE =================
// How to use these services in Express routes:

/*
const express = require('express');
const router = express.Router();

// Users
router.get('/users', async (req, res) => {
    const { page, limit } = req.query;
    const result = await UserService.getAll(page, limit);
    res.json(result);
});

router.post('/users', async (req, res) => {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
});

router.get('/users/:id', async (req, res) => {
    const user = await UserService.getById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

router.put('/users/:id', async (req, res) => {
    const user = await UserService.update(req.params.id, req.body);
    res.json(user);
});

router.delete('/users/:id', async (req, res) => {
    await UserService.delete(req.params.id);
    res.send('User deleted');
});

// Posts
router.get('/posts', async (req, res) => {
    const posts = await PostService.getAll(req.query);
    res.json(posts);
});

router.post('/posts', async (req, res) => {
    const post = await PostService.create(req.body);
    res.status(201).json(post);
});

router.post('/posts/:id/like', async (req, res) => {
    const post = await PostService.likePost(req.params.id);
    res.json(post);
});

module.exports = router;
*/

module.exports = { User, Post, UserService, PostService };
