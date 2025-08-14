// Routing in Express defines 
// how your server responds to client requests
// at specific endpoints (URLs) with specific HTTP methods.

const express = require('express');
const app = express();

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to My Express Server');
});

// Static route
app.get('/about', (req, res) => {
  res.send('This is the About Page');
});

// Dynamic route
app.get('/user/:name', (req, res) => {
  res.send(`Hello ${req.params.name}`);
});

// Query parameter route
app.get('/search', (req, res) => {
  const query = req.query.q || 'nothing';
  res.send(`You searched for: ${query}`);
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
