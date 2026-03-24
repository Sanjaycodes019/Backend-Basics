/*
================================================================================
                    API DOCUMENTATION - SWAGGER NOTES
================================================================================

TABLE OF CONTENTS:
1. What is Swagger/OpenAPI?
2. Swagger UI Setup
3. Documenting Routes
4. Common Patterns
5. Full Example

================================================================================
1. WHAT IS SWAGGER/OPENAPI?
================================================================================

- Standard format for describing REST APIs
- Interactive documentation UI
- Auto-generated from code comments or separate files
- Can test API directly from documentation

INSTALL:
  npm install swagger-jsdoc swagger-ui-express

================================================================================
2. SWAGGER SETUP
================================================================================

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation for my app'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development' }
        ]
    },
    apis: ['./routes/*.js']  // Files with Swagger comments
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

================================================================================
3. DOCUMENTING ROUTES (JSDoc Comments)
================================================================================

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
app.get('/users', getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get('/users/:id', getUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
app.post('/users', createUser);

================================================================================
4. SCHEMA DEFINITIONS
================================================================================

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - email
 *     
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *           format: password
 *       required:
 *         - name
 *         - email
 *         - password
 *     
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Protected route with auth
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
app.get('/profile', authenticate, getProfile);

================================================================================
5. COMPLETE EXAMPLE
================================================================================
*/

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'A simple User API',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [__filename]  // This file contains routes
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// In-memory data
let users = [];

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
app.get('/api/users', (req, res) => {
    res.json(users);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
app.post('/api/users', (req, res) => {
    const user = { id: Date.now().toString(), ...req.body };
    users.push(user);
    res.status(201).json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
});

console.log('=== API DOCUMENTATION NOTES ===');
console.log('Install: npm install swagger-jsdoc swagger-ui-express');
console.log('Visit: http://localhost:3000/api-docs');

module.exports = app;
