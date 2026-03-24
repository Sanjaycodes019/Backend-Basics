/*
================================================================================
                    ERROR HANDLING & LOGGING - NOTES
================================================================================

TABLE OF CONTENTS:
1. Express Error Handling Patterns
2. Custom Error Classes
3. Async Error Handling
4. Winston Logger Setup
5. Morgan HTTP Logging
6. Central Error Handler

================================================================================
1. EXPRESS ERROR HANDLING PATTERNS
================================================================================

SYNC ERRORS (automatically caught):
  app.get('/error', (req, res) => {
      throw new Error('Something broke!');
      // Caught by Express error handler
  });

ASYNC ERRORS (must use next()):
  app.get('/async-error', async (req, res, next) => {
      try {
          await someAsyncOperation();
      } catch (err) {
          next(err);  // Pass to error handler
      }
  });

// Or use express-async-handler
const asyncHandler = require('express-async-handler');

app.get('/route', asyncHandler(async (req, res) => {
    // Throws automatically caught and passed to error handler
    const data = await operation();
    res.json(data);
}));

================================================================================
2. CUSTOM ERROR CLASSES
================================================================================

// Base App Error
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific Error Types
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

// Usage
app.get('/user/:id', async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new NotFoundError('User not found'));
    }
    res.json(user);
});

================================================================================
3. WINSTON LOGGER SETUP
================================================================================

INSTALL:
  npm install winston

CONFIGURATION:

const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write to files
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Don't log to files in test environment
if (process.env.NODE_ENV === 'test') {
    logger.silent = true;
}

// Usage
logger.info('Server started on port 3000');
logger.error('Database connection failed', { error: err });
logger.warn('Rate limit approaching', { userId: req.user.id });

================================================================================
4. MORGAN HTTP LOGGING
================================================================================

INSTALL:
  npm install morgan

SETUP:

const morgan = require('morgan');

// Predefined formats
app.use(morgan('dev'));     // Concise colored output
app.use(morgan('tiny'));    // Minimal
app.use(morgan('combined')); // Standard Apache format

// Custom format with Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Skip logging for successful health checks
app.use(morgan('dev', {
    skip: (req, res) => req.url === '/health' && res.statusCode < 400
}));

================================================================================
5. CENTRAL ERROR HANDLER
================================================================================

const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        user: req.user?.id
    });
    
    // Operational errors (trusted) - send to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    
    // Programming/unknown errors - don't leak details
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};

// Must be last middleware
app.use(errorHandler);

================================================================================
6. UNHANDLED REJECTIONS & EXCEPTIONS
================================================================================

// Catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥', err);
    // Close server & exit
    server.close(() => {
        process.exit(1);
    });
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥', err);
    process.exit(1);
});

================================================================================
COMPLETE EXAMPLE
================================================================================
*/

const express = require('express');
const winston = require('winston');
const morgan = require('morgan');

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()]
});

// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/success', (req, res) => {
    res.json({ status: 'success' });
});

app.get('/error', (req, res, next) => {
    next(new AppError('Something went wrong!', 500));
});

app.get('/not-found', (req, res, next) => {
    next(new AppError('Resource not found', 404));
});

// Central error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl}`);
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

console.log('=== ERROR HANDLING & LOGGING NOTES ===');
console.log('Install: npm install winston morgan');

module.exports = { app, AppError, logger };
