const express = require('express')
const Course = require('../Models/courseModel')

const router = express.Router();



// All Course API 
router.get('/course', async (req, res) => {
  try {
    const course = await Course.find({});
    res.json({ status: true, message: "All Course Details", course });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = router;
