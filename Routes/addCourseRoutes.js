const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/CourseController');
const adminAuth = require('../Middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ------------------------
// Local Multer Storage
// ------------------------
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// ------------------------
// ROUTES
// ------------------------

// Render Add Course Form
router.get('/', adminAuth, courseController.renderAddCourseForm);

// Add Course
router.post('/submit-form-course', 
  upload.fields([
    { name: 'courseImage', maxCount: 1 },
    { name: 'courseBannerImage', maxCount: 1 },
    { name: 'courseBrochure', maxCount: 1 }
  ]),
  courseController.addCourse
);

// Delete Course
router.post('/delete/:id', courseController.deleteCourse);

// Render Edit Course Form
router.get('/edit/:id', courseController.renderEditCourseForm);

// Update Course
router.post('/update/:id', 
  upload.fields([
    { name: 'courseImage', maxCount: 1 },
    { name: 'courseBannerImage', maxCount: 1 },
    { name: 'courseBrochure', maxCount: 1 }
  ]),
  courseController.updateCourse
);

module.exports = router;
