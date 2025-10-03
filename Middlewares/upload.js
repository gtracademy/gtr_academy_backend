// Middlewares/upload.js
const multer = require('multer');

// Define the allowed MIME types for images and videos
const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mov|webp|avi/;

// File filter function to check the file type
const fileFilter = (req, file, cb) => {
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (mimeType) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images and videos are allowed'), false); // Reject the file
  }
};

// Set up the storage location and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store the files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  }
});

// Initialize multer with storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = upload;
