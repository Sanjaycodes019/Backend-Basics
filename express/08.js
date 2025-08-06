// handling query parameters

const express = require('express');
const app = express();

app.get('/search', (req, res) => {
    const keyword = req.query.q;      // Get the value of ?q=
    const category = req.query.cat;   // Get the value of ?cat=
    
    res.send(`Searching for: ${keyword} in category: ${category || 'all'}`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
