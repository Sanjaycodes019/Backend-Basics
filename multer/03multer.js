// Uses custom disk storage with timestamped filenames.
// Limits file size to 2MB.
// Accepts only JPEG and PNG images (customizable).
// Three route examples:
// /upload-single — for one file.
// /upload-multiple — for multiple files under one field.
// /upload-fields — handles different fields.
// Comprehensive error handling included

const express = require('express');
const multer = require('multer');
const app = express();

// -----------------------
// 1. Custom Disk Storage with filename customization
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files will be saved in 'uploads/' directory
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Naming files: current timestamp + original file name
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// -----------------------
// 2. File Filter function (accept only JPEG and PNG images)
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only JPEG and PNG files are allowed'), false); // Reject file
  }
};

// -----------------------
// 3. Multer upload instance with limits, storage, and file filter
const upload = multer({
  storage: storage,                 // Custom storage configuration
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
  fileFilter: fileFilter            // File filter function
});

// -----------------------------------------------------------------
// ROUTES

// Upload single file with field name 'file'
app.post('/upload-single', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded or invalid file type.');
  }
  res.send(`Single file uploaded successfully: ${req.file.filename}`);
});

// Upload multiple files with the same field name 'photos' (up to 5)
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded or invalid file types.');
  }
  res.send(`Multiple files uploaded successfully: ${req.files.length} files.`);
});

// Upload multiple fields: one file as 'avatar' and up to 8 files as 'gallery'
app.post('/upload-fields', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]), (req, res) => {
  if (!req.files || ( !req.files['avatar'] && !req.files['gallery'] )) {
    return res.status(400).send('No files uploaded or invalid file types.');
  }
  res.send('Files uploaded for avatar and gallery successfully.');
});

// -----------------------
// Error handling middleware for Multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handling Multer-specific errors
    return res.status(400).send(`Multer Error: ${err.message}`);
  } else if (err) {
    // Handling other errors
    return res.status(400).send(`Error: ${err.message}`);
  }
  next();
});


// -----------------------
// Start the Express server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
