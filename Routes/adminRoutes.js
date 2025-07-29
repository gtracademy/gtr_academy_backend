const express = require('express');
const router = express.Router();
const Course = require('../Models/courseModel');

// Admin Home Page Show
router.get('/',(req,res)=>{
    res.render('courseAdd')
})
 


// Handle form submission
router.post('/submit-form-enquiry', async (req, res) => {
  try {
    console.log(req.body);
    // const newCourse = new Course(req.body);
    // await newCourse.save();
    res.status(201).send("✅ Course saved successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to save course.");
  }
});
 


module.exports = router;