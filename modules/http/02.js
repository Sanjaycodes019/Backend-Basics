const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route: Serve login form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Route: Handle form submission
app.post("/sendData", (req, res) => {
    console.log(req.body);
});

app.get('/style.css', (req, res)=>{
    res.sendFile(__dirname, "style.css")
})
// Start server
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
