const express = require('express');
const app = express();

// Import user routes
const userRoutes = require('./routes/users');

// Mount the user routes at /api/users
app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
