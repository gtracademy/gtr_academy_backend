const express = require('express')
const Course = require('../Models/courseModel')
const Mentor = require('../Models/mentorModel')
const Testimonial = require('../Models/testimonialModel')

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

// Mentors API

router.get('/mentor', async(req,res)=>{
  try {
    const mentor = await Mentor.find({});
    res.json({status:true, message:"All Mentor Details",mentor})
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
})




// Testimonial API

router.get('/testimonial', async(req,res)=>{
  try {
    const testimonial = await Testimonial.find({});
    res.json({status:true, message:"All Testimonial Details",testimonial})
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
})
 






module.exports = router;

