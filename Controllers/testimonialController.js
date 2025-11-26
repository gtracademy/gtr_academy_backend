const Testimonial = require('../Models/testimonialModel');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

// 🌐 Public Testimonials (only approved)
exports.showTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.render('testimonialUser', { testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).send('Internal server error');
  }
};

// ✅ Create Testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, company, salary, message, course, rating, videoUrlTestimonial } = req.body;

    // Ensure rating is between 1 and 5
    const parsedRating = parseInt(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).send('Rating must be between 1 and 5.');
    }

    const imageUrl = req.files.image ? `/uploads/${req.files.image[0].filename}` : '';
    const videoUrl = req.files.video ? `/uploads/${req.files.video[0].filename}` : '';

    const newTestimonial = new Testimonial({
      name,
      company,
      salary,
      message,
      course,
      rating: parsedRating,
      imageUrl,
      videoUrl,
      videoUrlTestimonial,
      status: 'pending',
    });

    await newTestimonial.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).send('Internal Server Error');
  }
};

// 🔐 Admin Panel: View all Testimonials
exports.showAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.render('testimonialAdmin', { testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).send('Internal server error');
  }
};

// ✅ Approve Testimonial
exports.approveTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.redirect('/testimonial/admin');
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).send('Internal server error');
  }
};

// ❌ Reject Testimonial
exports.rejectTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.redirect('/testimonial/admin');
  } catch (error) {
    console.error('Error rejecting testimonial:', error);
    res.status(500).send('Internal server error');
  }
};

// ✏️ Edit Testimonial Form
exports.renderEditTestimonialForm = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).send('Testimonial not found');
    res.render('testimonialEdit', { testimonial });
  } catch (error) {
    console.error('Error loading testimonial for editing:', error);
    res.status(500).send('Internal server error');
  }
};

// ✏️ Update Testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, company, salary, message, course, status, rating, videoUrlTestimonial } = req.body;

    const parsedRating = parseInt(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).send('Rating must be between 1 and 5.');
    }

    const updateData = { name, company, salary, message, course, status, rating: parsedRating, videoUrlTestimonial };

    if (req.files.image) {
      updateData.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }

    if (req.files.video) {
      updateData.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    await Testimonial.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/testimonial/admin');
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).send('Internal server error');
  }
};

// ❌ Delete Testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.redirect('/testimonial/admin');
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).send('Internal server error');
  }
};
