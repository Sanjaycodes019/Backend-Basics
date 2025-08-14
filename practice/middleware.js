// middleware is a function that runs 
// between the time a request comes
//  in and the time a response is sent.
// Think of it like airport security 
// — every passenger (request) must 
// pass through it before boarding (response).

const express = require('express');
const app = express();
const morgan = require('morgan');

// Built-in middleware
app.use(express.json());

// Third-party middleware
app.use(morgan('dev'));

// Application-level middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route-level middleware
function checkAuth(req, res, next) {
  const token = req.query.token;
  if (token === '123') {
    next();
  } else {
    res.status(403).send('Forbidden: Invalid token');
  }
}

// Public route
app.get('/', (req, res) => {
  res.send('Public Homepage');
});

// Protected route
app.get('/secret', checkAuth, (req, res) => {
  res.send('Welcome to the secret area!');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
