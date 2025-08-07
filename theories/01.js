const express = require('express');
const app = express();

app.use(express.json());

// Params
app.get('/user/:id', (req, res) => {
    res.send(`User ID is ${req.params.id}`);
});

// Query
app.get('/search', (req, res) => {
    res.send(`Search for ${req.query.q}`);
});

// Body
app.post('/register', (req, res) => {
    const { name, email } = req.body;
    res.send(`User ${name} with email ${email} registered!`);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
