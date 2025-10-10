const express = require('express');
const Course = require('../Models/courseModel');
const Mentor = require('../Models/mentorModel');

const router = express.Router();

/**
 * @route   GET /api/search?name=python
 * @desc    Search courses by name (courseTitle)
 * @access  Public or protected (add middleware if needed)
 */
router.get('/', async (req, res) => {
  try {
    const query = req.query.name?.trim() || "";

    // Search courses by courseTitle (case-insensitive)
    const courses = await Course.find({
      courseTitle: { $regex: query, $options: 'i' }
    }).populate('mentor');

    // Optional: fetch mentors and categories (if needed in frontend)
    const mentors = await Mentor.find({});
    const categories = ["SAP", "Data", "Other"];

    res.json({
      success: true,
      count: courses.length,
      data: courses,
      query,
      mentors,
      categories
    });
  } catch (error) {
    console.error('❌ Error in searchRoute:', error);
    res.status(500).json({
      success: false,
      message: '❌ Failed to search courses.',
      error: error.message
    });
  }
});

module.exports = router;
