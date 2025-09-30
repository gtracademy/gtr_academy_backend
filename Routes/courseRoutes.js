const express = require('express');
const CourseForm = require('../Models/courseFormModel');
const router = express.Router();
const adminAuth = require('../Middlewares/authMiddleware')


// Show Course Page
router.get('/course', adminAuth,async (req, res) => {
    res.render('course');
});


// Route to handle course form submission
router.post('/submit-course-form', async (req, res) => {        
    try {
        const { name, email, phone,course } = req.body;

        // Create a new CourseForm instance
        const newCourseForm = new CourseForm({ name, email, phone });
        await newCourseForm.save();
        
        res.status(201).json({ message: 'Course form submitted successfully', data: newCourseForm });
    } catch (error) {
        console.error('Error submitting course form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;