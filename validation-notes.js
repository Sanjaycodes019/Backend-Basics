/*
================================================================================
                    INPUT VALIDATION - JOI NOTES
================================================================================

TABLE OF CONTENTS:
1. Why Validate Input?
2. Joi Basics
3. Schema Types
4. Validation Patterns
5. Custom Error Messages
6. Integration with Express

================================================================================
1. WHY VALIDATE INPUT?
================================================================================

- Prevent invalid data in database
- Protect against injection attacks
- Provide clear error messages to clients
- Reduce bugs from unexpected data types

INSTALL:
  npm install joi

================================================================================
2. JOI BASICS
================================================================================

const Joi = require('joi');

// Define schema
const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).max(150),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
});

// Validate data
const data = { username: 'john', email: 'john@example.com' };
const result = schema.validate(data);

// Check result
if (result.error) {
    console.log(result.error.details);
} else {
    console.log('Valid!', result.value);
}

================================================================================
3. SCHEMA TYPES
================================================================================

STRINGS:
  Joi.string()                    // Any string
  Joi.string().min(3)             // Minimum 3 chars
  Joi.string().max(30)            // Maximum 30 chars
  Joi.string().email()            // Valid email
  Joi.string().uuid()             // Valid UUID
  Joi.string().uri()              // Valid URL
  Joi.string().pattern(/regex/)   // Regex pattern
  Joi.string().alphanum()         // Only letters and numbers
  Joi.string().lowercase()        // Convert to lowercase
  Joi.string().uppercase()        // Convert to uppercase
  Joi.string().trim()             // Remove whitespace
  Joi.string().valid('a', 'b')    // Only specific values

NUMBERS:
  Joi.number()                    // Any number
  Joi.number().integer()          // Integer only
  Joi.number().min(0)             // Minimum value
  Joi.number().max(100)           // Maximum value
  Joi.number().positive()         // > 0
  Joi.number().negative()         // < 0
  Joi.number().precision(2)       // Max 2 decimal places

BOOLEANS:
  Joi.boolean()                   // true or false

DATES:
  Joi.date()                      // Any date
  Joi.date().iso()                // ISO format
  Joi.date().min('now')           // Must be in future
  Joi.date().max('1-1-2050')      // Max date

ARRAYS:
  Joi.array()                     // Any array
  Joi.array().items(Joi.string()) // Array of strings
  Joi.array().min(1)              // At least 1 item
  Joi.array().max(10)             // At most 10 items
  Joi.array().unique()            // No duplicates

OBJECTS:
  Joi.object({
      key: Joi.string()
  })
  Joi.object().keys({...})        // Define keys
  Joi.object().unknown(false)     // No extra keys allowed

================================================================================
4. VALIDATION PATTERNS
================================================================================

// Nested objects
const userSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        zipCode: Joi.string().pattern(/^\d{5}$/)
    }).required()
});

// Arrays of objects
const orderSchema = Joi.object({
    customerId: Joi.string().required(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
            price: Joi.number().positive().required()
        })
    ).min(1).required()
});

// Alternatives (one of several types)
const idSchema = Joi.alternatives().try(
    Joi.string().uuid(),
    Joi.number().integer().positive()
);

// Conditional validation
const schema = Joi.object({
    role: Joi.string().valid('user', 'admin').required(),
    adminCode: Joi.when('role', {
        is: 'admin',
        then: Joi.string().required(),
        otherwise: Joi.optional()
    })
});

================================================================================
5. CUSTOM ERROR MESSAGES
================================================================================

const schema = Joi.object({
    username: Joi.string().min(3).max(30).required()
        .messages({
            'string.base': 'Username must be a string',
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least {#limit} characters',
            'any.required': 'Username is required'
        }),
    
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email'
        }),
    
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
            'string.pattern.base': 'Password must contain uppercase, lowercase, and number'
        })
});

================================================================================
6. EXPRESS INTEGRATION
================================================================================

// Middleware approach
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.details[0].message
            });
        }
        
        // Replace body with validated/sanitized value
        req.body = value;
        next();
    };
};

// Schemas
const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')
});

const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email()
}).min(1);  // At least one field required

// Routes
app.post('/users', validate(createUserSchema), async (req, res) => {
    // Body is already validated
    const user = await User.create(req.body);
    res.status(201).json(user);
});

// Query validation
const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('name', 'email', 'createdAt')
});

app.get('/users', async (req, res, next) => {
    const { error, value } = querySchema.validate(req.query);
    if (error) return next(new Error(error.details[0].message));
    
    // Use validated query params
    const users = await User.find().limit(value.limit).skip((value.page - 1) * value.limit);
    res.json(users);
});

*/

const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const messages = error.details.map(d => d.message);
            return res.status(400).json({ status: 'fail', errors: messages });
        }
        
        req.body = value;
        next();
    };
};

// User schema
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    age: Joi.number().integer().min(0).max(150),
    password: Joi.string().min(6).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .message('Password must have uppercase, lowercase, and number')
});

// Route
app.post('/register', validate(userSchema), (req, res) => {
    res.json({ 
        message: 'Validation passed', 
        data: req.body 
    });
});

console.log('=== INPUT VALIDATION NOTES ===');
console.log('Install: npm install joi');

module.exports = { app, validate };
