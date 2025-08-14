const express = require('express');
const router = express.Router();

// Dummy user data
const users = [
  { id: 1, name: "Sanjay" },
  { id: 2, name: "Simone" },
  { id: 3, name: "Gopal" }
];

// GET /users - return all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET /users/:id - return a single user
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
