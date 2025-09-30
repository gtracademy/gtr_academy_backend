const express = require('express');
const router = express.Router();
const courseModel = require('../Models/courseModel');

// Import the HomeForm model
const HomeForm = require('../Models/homeFormModel');


// Show Home Page 
router.get("/",async(req,res)=>{
    const course = await courseModel.find();
  res.render('adminHome',{course})
})


// Route to handle form submission
router.post('/submit-form-enquiry', async (req, res)=> {
    try {
        const { name, phone } = req.body;

        // Create a new HomeForm instance
        const newForm = await new HomeForm({ name, phone });
        newForm.save();
        res.status(201).json({ message: 'Form submitted successfully', data: newForm });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}) 



module.exports = router;