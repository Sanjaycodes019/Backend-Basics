const express = require('express');
const path = require('path');
const app = express();

// Route to serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'index.html'));
});

// Route to serve CSS
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'style.css'));
});

// Route to serve JS
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'script.js'));
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
