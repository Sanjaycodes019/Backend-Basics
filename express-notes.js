/*
================================================================================
                        EXPRESS.JS - COMPLETE NOTES
================================================================================

TABLE OF CONTENTS:
1. What is Express?
2. Basic Server Setup
3. Routing
4. Request Object (req)
5. Response Object (res)
6. Middleware
7. Static Files
8. Router Module
9. Error Handling
10. Common Patterns

================================================================================
1. WHAT IS EXPRESS?
================================================================================

Express is a minimal, fast web framework for Node.js.

WHY USE EXPRESS?
+ Clean, readable syntax
+ Built-in routing
+ Middleware support
+ Easy static file serving
+ Huge ecosystem

WITHOUT EXPRESS (core http):
  if (req.url === '/' && req.method === 'GET') { ... }

WITH EXPRESS:
  app.get('/', (req, res) => { ... });

================================================================================
2. BASIC SERVER SETUP
================================================================================

const express = require('express');
const app = express();           // Create Express app
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

================================================================================
3. ROUTING
================================================================================

HTTP METHODS IN EXPRESS:
  app.get(path, handler)      → Handle GET requests
  app.post(path, handler)     → Handle POST requests  
  app.put(path, handler)      → Handle PUT requests
  app.delete(path, handler)   → Handle DELETE requests
  app.patch(path, handler)    → Handle PATCH requests
  app.all(path, handler)      → Handle ALL methods

ROUTE EXAMPLES:

// Simple route
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Route with response types
app.get('/html', (req, res) => {
    res.send('<h1>HTML Response</h1>');
});

app.get('/json', (req, res) => {
    res.json({ message: 'JSON Response', status: 200 });
});

app.get('/status', (req, res) => {
    res.status(404).send('Not Found');
});

================================================================================
4. REQUEST OBJECT (req) - EVERYTHING ABOUT REQUEST
================================================================================

req.params     → URL parameters (/user/:id → req.params.id)
req.query      → Query strings (/search?q=hello → req.query.q)
req.body       → Request body (POST data, needs middleware)
req.headers    → Request headers
req.url        → Request URL path
req.method     → HTTP method
req.path       → URL path

URL PARAMETERS:
  // URL: /user/123
  app.get('/user/:id', (req, res) => {
      const userId = req.params.id;  // "123"
      res.send(`User ID: ${userId}`);
  });

  // Multiple parameters
  // URL: /blog/2024/03/my-post
  app.get('/blog/:year/:month/:slug', (req, res) => {
      const { year, month, slug } = req.params;
      res.send(`${year}/${month} - ${slug}`);
  });

QUERY PARAMETERS:
  // URL: /search?q=nodejs&limit=10
  app.get('/search', (req, res) => {
      const searchTerm = req.query.q;       // "nodejs"
      const limit = req.query.limit;         // "10"
      res.send(`Searching: ${searchTerm}, Limit: ${limit}`);
  });

REQUEST BODY (needs middleware):
  app.use(express.json());        // For JSON data
  app.use(express.urlencoded());  // For form data
  
  app.post('/login', (req, res) => {
      const { username, password } = req.body;
      res.send(`Welcome, ${username}`);
  });

================================================================================
5. RESPONSE OBJECT (res) - EVERYTHING ABOUT RESPONSE
================================================================================

res.send(data)           → Send string, object, or buffer
res.json(obj)            → Send JSON response
res.status(code)         → Set status code
res.sendStatus(code)     → Set status and send text
res.redirect(url)        → Redirect to URL
res.render(view)         → Render template (if using view engine)
res.file(path)           → Send file
res.download(path)       → Prompt file download

CHAINING:
  res.status(201).json({ message: 'Created' });
  res.status(404).send('Not Found');

================================================================================
6. MIDDLEWARE
================================================================================

WHAT IS MIDDLEWARE?
Function that runs between request and response.
Can modify req/res, end response, or pass to next middleware.

SYNTAX:
  function middleware(req, res, next) {
      // Do something
      next();  // Pass to next middleware
  }

TYPES OF MIDDLEWARE:

1. APPLICATION-LEVEL (runs on all routes):
   app.use(middleware);

2. ROUTER-LEVEL (runs on specific routes):
   router.use(middleware);

3. BUILT-IN (provided by Express):
   app.use(express.json());       // Parse JSON body
   app.use(express.urlencoded()); // Parse form data
   app.use(express.static('public')); // Serve static files

4. ERROR-HANDLING (4 parameters):
   app.use((err, req, res, next) => {
       res.status(500).send(err.message);
   });

5. THIRD-PARTY (npm packages):
   const morgan = require('morgan');
   app.use(morgan('dev'));  // Logger

MIDDLEWARE EXAMPLE:

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Auth middleware
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    next();
}

// Use on specific route
app.get('/admin', authMiddleware, (req, res) => {
    res.send('Admin Panel');
});

EXECUTION ORDER:
  Middleware runs in the order they are defined!

================================================================================
7. STATIC FILES
================================================================================

Serve HTML, CSS, JS, images from a folder:

app.use(express.static('public'));

// Now files in 'public/' folder are accessible:
// public/style.css → http://localhost:3000/style.css
// public/index.html → http://localhost:3000/index.html

// With virtual path prefix:
app.use('/static', express.static('public'));
// public/style.css → http://localhost:3000/static/style.css

================================================================================
8. ROUTER MODULE - MODULAR ROUTING
================================================================================

Create separate route files for organization:

// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('All users');
});

router.get('/:id', (req, res) => {
    res.send(`User ${req.params.id}`);
});

router.post('/', (req, res) => {
    res.send('Create user');
});

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Now available:
// GET /users       → List users
// GET /users/123   → Get user 123
// POST /users      → Create user

================================================================================
9. ERROR HANDLING
================================================================================

SYNC ERRORS (automatically caught):
  app.get('/error', (req, res) => {
      throw new Error('Something broke!');
  });

ASYNC ERRORS (must use next()):
  app.get('/async-error', async (req, res, next) => {
      try {
          const data = await someAsyncOperation();
          res.json(data);
      } catch (err) {
          next(err);  // Pass to error handler
      }
  });

ERROR HANDLER (must be last):
  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
          error: err.message,
          status: 500 
      });
  });

================================================================================
10. COMMON PATTERNS
================================================================================

STARTER TEMPLATE:

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Error handling
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

ENVIRONMENT CONFIG:
  const isDev = process.env.NODE_ENV === 'development';
  const PORT = process.env.PORT || 3000;

================================================================================
REVISION CHECKLIST
================================================================================

□ app = express() creates app
□ app.listen(PORT) starts server
□ app.get/post/put/delete for routes
□ req.params for URL segments
□ req.query for query strings
□ req.body for POST data (needs middleware)
□ res.send() for text/html
□ res.json() for JSON
□ res.status() for status codes
□ app.use() for middleware
□ express.json() parses JSON body
□ express.static() serves files
□ express.Router() for modular routes
□ Error handler has 4 params: (err, req, res, next)

================================================================================
*/

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Express Notes Server Running');
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Express Notes',
        topics: ['Routing', 'Middleware', 'Request/Response']
    });
});

// Start (commented to prevent auto-run in notes file)
// app.listen(PORT, () => console.log(`Server on port ${PORT}`));

console.log('=== EXPRESS.JS NOTES FILE ===');
console.log('This file contains inline notes for Express concepts');
console.log('Read the comments above for revision');
console.log('');
console.log('Uncomment app.listen() at bottom to test server');
