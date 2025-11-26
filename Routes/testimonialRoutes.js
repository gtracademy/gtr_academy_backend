const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/upload'); // Multer setup (image/video)
const adminAuth = require('../Middlewares/authMiddleware');
const testimonialController = require('../controllers/testimonialController');

// 🌐 Public Testimonials (only approved)
router.get('/', testimonialController.showTestimonials);

// ✅ Create Testimonial
router.post('/submit', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), testimonialController.createTestimonial);

// 🔐 Admin Panel: Show all Testimonials
router.get('/admin', adminAuth, testimonialController.showAdminTestimonials);

// ✅ Approve Testimonial
router.post('/admin/approve/:id', testimonialController.approveTestimonial);

// ❌ Reject Testimonial
router.post('/admin/reject/:id', testimonialController.rejectTestimonial);

// ✏️ Edit Testimonial Form
router.get('/admin/edit/:id', adminAuth, testimonialController.renderEditTestimonialForm);

// ✏️ Update Testimonial
router.post('/admin/edit/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), testimonialController.updateTestimonial);

// ❌ Delete Testimonial
router.post('/admin/delete/:id', adminAuth, testimonialController.deleteTestimonial);

module.exports = router;
