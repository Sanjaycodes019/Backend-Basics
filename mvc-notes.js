/*
================================================================================
                    MVC ARCHITECTURE - NOTES
================================================================================

TABLE OF CONTENTS:
1. What is MVC?
2. Project Structure
3. Model
4. View (API Response)
5. Controller
6. Service Layer
7. Routes
8. Middleware
9. Complete Example

================================================================================
1. WHAT IS MVC?
================================================================================

MVC = Model - View - Controller

Model       → Data layer (database, business logic)
View        → Presentation layer (API response, UI)
Controller  → Handles requests, coordinates Model & View

WHY MVC?
+ Separation of concerns
+ Easier testing
+ Maintainable code
+ Scalable structure

================================================================================
2. PROJECT STRUCTURE
================================================================================

project/
├── config/         → Configuration files
│   └── database.js
├── controllers/    → Request handlers
│   └── userController.js
├── models/         → Database schemas
│   └── User.js
├── routes/         → Route definitions
│   └── userRoutes.js
├── services/       → Business logic
│   └── userService.js
├── middleware/     → Custom middleware
│   └── auth.js
├── utils/          → Utility functions
│   └── logger.js
├── app.js          → Express app setup
└── server.js       → Entry point

================================================================================
3. MODEL (models/User.js)
================================================================================

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// Instance methods
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

// Middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);

================================================================================
4. SERVICE (services/userService.js)
================================================================================

const User = require('../models/User');
const AppError = require('../utils/AppError');

class UserService {
    async createUser(userData) {
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
            throw new AppError('Email already registered', 400);
        }
        return await User.create(userData);
    }
    
    async getAllUsers(query) {
        const { page = 1, limit = 10, sort = '-createdAt' } = query;
        
        const users = await User.find()
            .select('-password')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const count = await User.countDocuments();
        
        return {
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    }
    
    async getUserById(id) {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }
    
    async updateUser(id, updateData) {
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }
    
    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }
}

module.exports = new UserService();

================================================================================
5. CONTROLLER (controllers/userController.js)
================================================================================

const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

// Wrap async functions to catch errors
exports.getAllUsers = catchAsync(async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    
    res.status(200).json({
        status: 'success',
        data: result
    });
});

exports.getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    
    res.status(201).json({
        status: 'success',
        data: { user }
    });
});

exports.updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

================================================================================
6. ROUTES (routes/userRoutes.js)
================================================================================

const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const userSchema = require('../validators/userSchema');

const router = express.Router();

// Public routes
router.post('/register', validate(userSchema.create), userController.createUser);

// Protected routes
router.use(auth.authenticate);  // All routes below require auth

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', auth.authorize('admin'), validate(userSchema.update), userController.updateUser);
router.delete('/:id', auth.authorize('admin'), userController.deleteUser);

module.exports = router;

================================================================================
7. MIDDLEWARE (middleware/auth.js)
================================================================================

const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new AppError('No token provided', 401);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) throw new AppError('User not found', 401);
        
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Not authorized', 403));
        }
        next();
    };
};

================================================================================
8. APP SETUP (app.js)
================================================================================

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

module.exports = app;

================================================================================
9. ENTRY POINT (server.js)
================================================================================

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mvc-app';

// Connect to DB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

================================================================================
10. UTILITY: Catch Async
================================================================================

// utils/catchAsync.js
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

================================================================================
*/

console.log('=== MVC ARCHITECTURE NOTES ===');
console.log('This shows professional folder structure');
console.log('Key: Separation of concerns (Model, Service, Controller, Route)');

module.exports = {};
