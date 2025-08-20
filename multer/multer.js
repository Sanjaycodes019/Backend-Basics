const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' }); 
// tells multer to store uploaded files in the 'uploads' directory

// endpoint to upload a single file with field name 'file.txt'
app.post('/upload', upload.single('file.txt'), (req, res) => {
    console.log(req.file); // logs the file information
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
  res.send('File uploaded successfully');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});