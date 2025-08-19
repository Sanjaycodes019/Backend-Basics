const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(session({
    secret: 'your secret key',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS

    }
}));

app.get("/", (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Number of views: ${req.session.views}`);
    } else {
        req.session.views = 1;
        res.send("Welcome! This is your first visit.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});