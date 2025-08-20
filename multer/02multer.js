// If you only do multer({ dest: 'uploads/' }), 
// Multer automatically creates files in the uploads folder.
// filenames will be random (not your original file name)
const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, callback){
        // saves file in the 'uploads' directory
        callback(null, 'uploads/');
    },
    filename: function(req, file, callback){
        // create filename like "timestamp-originalname"
        const newName = Date.now() + '-' + file.originalname;
        callback(null, newName);      
    }
});

const upload = multer({ storage: storage });

// endpoint to upload a single file with field name 'file.txt'
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send('File uploaded successfully');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});     