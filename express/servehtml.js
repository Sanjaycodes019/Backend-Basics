const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.send(`<h2>Hello ${name}, we received your email: ${email}</h2>`);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
