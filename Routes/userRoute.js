const express = require('express');
const router = express.Router();

// Hardcoded admin credentials
const USERNAME = 'admin';
const PASSWORD = 'Prashant123'; // You may want to store this securely in env later

// GET: Show login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST: Handle login form
router.post('/login',  (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/');
  } else {
    res.status(401).render('login', { error: 'Invalid username or password' });
  }
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // session cookie name
    res.redirect('/user/login');
  });
});

module.exports = router;
