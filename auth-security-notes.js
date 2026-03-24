/*
================================================================================
                    AUTHENTICATION & SECURITY - NOTES
================================================================================

TABLE OF CONTENTS:
1. JWT (JSON Web Tokens)
2. bcrypt (Password Hashing)
3. Authentication Flow
4. Protected Routes Middleware
5. CORS (Cross-Origin Resource Sharing)
6. Helmet (Security Headers)
7. Complete Auth System Example

================================================================================
1. JWT (JSON WEB TOKENS)
================================================================================

WHAT IS JWT?
- Compact, self-contained way to transmit information
- Consists of 3 parts: Header.Payload.Signature
- Used for authentication and information exchange

JWT STRUCTURE:
  header.payload.signature
  
  Header: Algorithm & token type
  Payload: Data (user id, role, exp time)
  Signature: Verifies token wasn't tampered

INSTALL:
  npm install jsonwebtoken

USAGE:

const jwt = require('jsonwebtoken');

// Generate token (on login)
const token = jwt.sign(
    { userId: user._id, role: user.role },  // Payload
    process.env.JWT_SECRET,                  // Secret key
    { expiresIn: '1h' }                       // Options
);

// Verify token (on protected routes)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Returns: { userId: '...', role: '...', iat: ..., exp: ... }

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        if (!token) return res.status(401).json({ error: 'No token' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Use on protected routes
app.get('/profile', authMiddleware, (req, res) => {
    // req.user contains decoded token data
    res.json({ userId: req.user.userId });
});

================================================================================
2. BCRYPT (PASSWORD HASHING)
================================================================================

WHY HASH PASSWORDS?
- Never store plain text passwords
- One-way encryption (can't reverse)
- Same password = different hash (salt)

INSTALL:
  npm install bcrypt

USAGE:

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;  // Higher = more secure but slower

// Hash password (on registration)
const hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
};

// Compare password (on login)
const comparePassword = async (password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
};

// Example in user schema
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
});

================================================================================
3. COMPLETE AUTHENTICATION FLOW
================================================================================

REGISTRATION FLOW:
1. Receive email, password
2. Check if user exists
3. Hash password with bcrypt
4. Save user to DB
5. Return success (no token yet)

LOGIN FLOW:
1. Receive email, password
2. Find user by email
3. Compare password with bcrypt.compare()
4. If valid, generate JWT
5. Return token to client

PROTECTED ROUTE FLOW:
1. Client sends request with Authorization header
2. Middleware extracts token
3. Verify token with jwt.verify()
4. Attach user data to req.user
5. Continue to route handler

================================================================================
4. CORS (CROSS-ORIGIN RESOURCE SHARING)
================================================================================

WHAT IS CORS?
- Security feature preventing unauthorized cross-origin requests
- Browser blocks requests from different origins by default

INSTALL:
  npm install cors

USAGE:

const cors = require('cors');

// Allow all origins (development only!)
app.use(cors());

// Restrictive configuration (production)
const corsOptions = {
    origin: ['http://localhost:3000', 'https://yourapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

================================================================================
5. HELMET (SECURITY HEADERS)
================================================================================

WHAT IS HELMET?
- Collection of middleware for security headers
- Protects against common attacks (XSS, clickjacking, etc.)

INSTALL:
  npm install helmet

USAGE:

const helmet = require('helmet');

// Apply all helmet middleware
app.use(helmet());

// Specific configurations
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
    }
}));

================================================================================
6. COMPLETE AUTH SYSTEM EXAMPLE
================================================================================

*/

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

// JWT Secret (use environment variable in production!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('No token');
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error('User not found');
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized', message: err.message });
    }
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Routes

// Register
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Create user (password auto-hashed by pre-save hook)
        const user = await User.create({ email, password });
        
        res.status(201).json({ 
            message: 'User created',
            userId: user._id 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected route - any authenticated user
app.get('/profile', authenticate, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Admin only route
app.get('/admin/users', authenticate, requireAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    res.json({ users });
});

// Refresh token
app.post('/auth/refresh', authenticate, (req, res) => {
    const token = jwt.sign(
        { userId: req.user._id, role: req.user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    res.json({ token });
});

// Logout (client-side: just delete token)
// For server-side logout, use token blacklist with Redis

/*
================================================================================
QUICK REFERENCE
================================================================================

JWT Methods:
  jwt.sign(payload, secret, options)    → Create token
  jwt.verify(token, secret)             → Verify token
  jwt.decode(token)                     → Decode without verify

bcrypt Methods:
  bcrypt.hash(password, saltRounds)     → Hash password
  bcrypt.compare(password, hash)        → Compare password
  bcrypt.genSalt(rounds)                → Generate salt

HTTP Headers:
  Authorization: Bearer <token>

Environment Variables (.env):
  JWT_SECRET=your-super-secret-key
  JWT_EXPIRE=24h
  BCRYPT_ROUNDS=10

================================================================================
SECURITY BEST PRACTICES
================================================================================

□ Store JWT_SECRET in environment variables
□ Use HTTPS in production
□ Set token expiration (don't use forever tokens)
□ Hash passwords with bcrypt (min 10 rounds)
□ Use Helmet for security headers
□ Configure CORS properly (don't use * in production)
□ Implement rate limiting on auth routes
□ Use httpOnly cookies for tokens (more secure than localStorage)
□ Implement refresh token pattern for long sessions
□ Add token blacklist for logout
□ Validate all inputs before processing
□ Don't return password hashes in API responses

================================================================================
*/

console.log('=== AUTHENTICATION & SECURITY NOTES ===');
console.log('This file contains complete auth system examples');
console.log('Required packages: npm install jsonwebtoken bcrypt cors helmet');

module.exports = { app, authenticate, requireAdmin };
