const express = require('express');
const router = express.Router();
const adminAuth = require('../Middlewares/authMiddleware');

// Import the home controller
const homeController = require('../controllers/homeController');

// Show Home Page
router.get("/", adminAuth, homeController.showHomePage);

// Route to handle form submission
router.post('/submit-form-enquiry', homeController.submitEnquiryForm);

// ------------------------
// LOGOUT ROUTE
// ------------------------
router.get('/logout', homeController.logout);

module.exports = router;
