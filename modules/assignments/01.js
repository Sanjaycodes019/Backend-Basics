const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve the admission form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, gender, dob, course, address } = req.body;

  console.log('Form Data Received:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Gender: ${gender}`);
  console.log(`DOB: ${dob}`);
  console.log(`Course: ${course}`);
  console.log(`Address: ${address}`);

  res.send(`<h2>Thank you, ${name}! Your application has been received.</h2>`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
