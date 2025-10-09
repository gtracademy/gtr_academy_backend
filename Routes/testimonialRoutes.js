const express = require('express');
const router = express.Router();
const Testimonial = require('../Models/testimonialModel');
const upload = require('../Middlewares/upload'); // Multer setup (image/video)
const adminAuth = require('../Middlewares/authMiddleware')


// 🌐 Public Testimonials (only approved)
router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
  res.render('testimonialUser', { testimonials });
});

// 📝 Submit Form
// router.get('/testimonial-submit', (req, res) => {
//   res.render('submit');
// });

// ✅ Create Testimonial
router.post('/submit', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, company, salary, message, course, rating } = req.body;

    // Ensure rating is between 1 and 5
    const parsedRating = parseInt(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).send('Rating must be between 1 and 5.');
    }

    const imageUrl = req.files.image ? `/uploads/${req.files.image[0].filename}` : '';
    const videoUrl = req.files.video ? `/uploads/${req.files.video[0].filename}` : '';

    await Testimonial.create({
      name,
      company,
      salary,
      message,
      course,
      rating: parsedRating,  // Save the rating value
      imageUrl,
      videoUrl,
      status: 'pending'
    });

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// 🔐 Admin Panel
router.get('/admin',adminAuth, async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.render('testimonialAdmin', { testimonials });
});

// ✅ Approve
router.post('/admin/approve/:id', async (req, res) => {
  await Testimonial.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.redirect('/testimonial/admin');
});

// ❌ Reject
router.post('/admin/reject/:id', async (req, res) => {
  await Testimonial.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.redirect('/testimonial/admin');
});

// ✏️ Edit Form
router.get('/admin/edit/:id',adminAuth, async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  res.render('testimonialEdit', { testimonial });
});

// ✏️ Update Testimonial
router.post('/admin/edit/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  const { name, company, salary, message, course, status, rating } = req.body;

  const updateData = { name, company, salary, message, course, status, rating };

  // Ensure rating is between 1 and 5
  const parsedRating = parseInt(rating);
  if (parsedRating < 1 || parsedRating > 5) {
    return res.status(400).send('Rating must be between 1 and 5.');
  }

  // Update the rating field
  updateData.rating = parsedRating;

  // Handle image and video file updates
  if (req.files.image) {
    updateData.imageUrl = `/uploads/${req.files.image[0].filename}`;
  }

  if (req.files.video) {
    updateData.videoUrl = `/uploads/${req.files.video[0].filename}`;
  }

  await Testimonial.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/testimonial/admin');
});

// ❌ Delete Testimonial
router.post('/admin/delete/:id', adminAuth,async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.redirect('/testimonial/admin');
});

module.exports = router;
