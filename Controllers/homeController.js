const courseModel = require('../Models/courseModel');
const HomeForm = require('../Models/homeFormModel');

// Show Home Page
exports.showHomePage = async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.render('adminHome', { course: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Internal server error');
  }
};

// Handle Enquiry Form Submission
exports.submitEnquiryForm = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Create a new HomeForm instance
    const newForm = new HomeForm({ name, phone });
    await newForm.save();
    res.status(201).json({ message: 'Form submitted successfully', data: newForm });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Handle Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Error destroying session:', err);
      return res.status(500).send('❌ Logout failed');
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/'); // Redirect to login page or homepage
  });
};
