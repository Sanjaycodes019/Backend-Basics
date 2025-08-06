// handling dynamic routes
const express = require('express');
const app = express();

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;  // Get the dynamic parameter
    res.send(`User ID is: ${userId}`);
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));



// multiple dynamic parameters
app.get('/blog/:year/:month/:title', (req, res) => {
    const { year, month, title } = req.params;
    res.send(`Blog: ${title} (Published: ${month}/${year})`);
});


// dynamic route + query parameters
app.get('/product/:id', (req, res) => {
    const { id } = req.params;
    const { category } = req.query;  // ?category=electronics
    res.send(`Product ID: ${id}, Category: ${category || 'General'}`);
});

