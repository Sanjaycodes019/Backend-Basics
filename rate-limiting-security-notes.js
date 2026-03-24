/*
================================================================================
                    RATE LIMITING & SECURITY - NOTES
================================================================================

TABLE OF CONTENTS:
1. Rate Limiting
2. express-rate-limit
3. Advanced Security Middleware
4. SQL/NoSQL Injection Prevention
5. XSS Prevention
6. Complete Security Setup

================================================================================
1. RATE LIMITING
================================================================================

WHY RATE LIMITING?
- Prevent brute force attacks
- Prevent API abuse
- Control server load
- Fair usage among users

INSTALL:
  npm install express-rate-limit

================================================================================
2. EXPRESS-RATE-LIMIT
================================================================================

const rateLimit = require('express-rate-limit');

// Basic rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 requests per windowMs
    message: {
        status: 'fail',
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,   // Return rate limit info in headers
    legacyHeaders: false     // Disable X-RateLimit headers
});

app.use(limiter);  // Apply to all routes

// Specific route limiter
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 5,                     // 5 attempts per hour
    skipSuccessfulRequests: true  // Don't count successful logins
});

app.use('/auth/', authLimiter);

// Custom key generator (by user ID instead of IP)
const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req, res) => req.user.id || req.ip,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

================================================================================
3. ADVANCED SECURITY MIDDLEWARE
================================================================================

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Helmet - sets security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// MongoDB sanitize - prevent NoSQL injection
app.use(mongoSanitize());

// XSS clean - prevent cross-site scripting
app.use(xss());

// HPP - prevent HTTP parameter pollution
app.use(hpp());

================================================================================
4. SQL/NOSQL INJECTION PREVENTION
================================================================================

BAD (vulnerable):
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  
GOOD (parameterized):
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email]);

// MongoDB - use Mongoose (safe by default)
// Never use eval() or new Function() with user input
// Never pass user input directly to where clauses

// Sanitize function
const sanitize = (str) => {
    return str.replace(/[${}]/g, '');
};

================================================================================
5. XSS PREVENTION
================================================================================

BAD (vulnerable):
  app.get('/search', (req, res) => {
      res.send(`<div>Results for: ${req.query.q}</div>`);
      // User can inject: <script>alert('xss')</script>
  });

GOOD (escaped):
  const escapeHtml = (unsafe) => {
      return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
  };
  
  res.send(`<div>Results for: ${escapeHtml(req.query.q)}</div>`);

// OR use xss-clean middleware

================================================================================
6. CORS SECURITY
================================================================================

const cors = require('cors');

// Restrictive CORS
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://yourapp.com'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400  // 24 hours
};

app.use(cors(corsOptions));

================================================================================
7. COMPLETE SECURITY SETUP
================================================================================
*/

const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// 3. Rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});
app.use(globalLimiter);

// Stricter for auth
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true
});
app.use('/api/auth', authLimiter);

// 4. Body parser
app.use(express.json({ limit: '10kb' }));

// 5. Data sanitization
app.use(mongoSanitize());  // NoSQL injection
app.use(xss());            // XSS attacks
app.use(hpp());            // Parameter pollution

// 6. Routes
app.get('/api/data', (req, res) => {
    res.json({ message: 'Secure data' });
});

console.log('=== RATE LIMITING & SECURITY NOTES ===');
console.log('Install: npm install express-rate-limit helmet express-mongo-sanitize xss-clean hpp cors');

module.exports = app;
