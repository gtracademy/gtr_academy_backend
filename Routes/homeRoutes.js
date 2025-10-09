const express = require('express');
const router = express.Router();
const courseModel = require('../Models/courseModel');
const adminAuth = require('../Middlewares/authMiddleware')

// Import the HomeForm model
const HomeForm = require('../Models/homeFormModel');


// Show Home Page 
router.get("/",adminAuth, async (req, res) => {
    const course = await courseModel.find();
    res.render('adminHome', { course })
})




// Route to handle form submission
router.post('/submit-form-enquiry', async (req, res) => {
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


// ------------------------
// LOGOUT ROUTE
// ------------------------
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Error destroying session:', err);
      return res.status(500).send('❌ Logout failed');
    }
    res.clearCookie('connect.sid'); // Optional: only if using default session cookie name
    res.redirect('/'); // Redirect to login page or homepage
  });
});



module.exports = router;