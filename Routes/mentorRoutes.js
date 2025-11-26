const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminAuth = require('../Middlewares/authMiddleware');
const mentorController = require('../Controllers/mentorController');

// ---------------- MULTER CONFIG ----------------
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

const router = express.Router();

// Show all mentors
router.get('/', mentorController.showMentors);

// Render Add Mentor Form
router.get('/add', mentorController.renderAddMentorForm);

// Handle Add Mentor
router.post('/add', upload.single("photo"), mentorController.addMentor);

// Render Edit Mentor Form
router.get('/edit/:id', adminAuth, mentorController.renderEditMentorForm);

// Handle Edit Mentor
router.post('/edit/:id', upload.single("photo"), mentorController.editMentor);

// Delete Mentor
router.post('/delete/:id', adminAuth, mentorController.deleteMentor);

module.exports = router;
