const express = require('express');
const router = express.Router();
const {showLoginPage, showLoginPageAutenticate, loginPageLogOut} = require('../Controllers/UserController')


// GET: Show login page
router.get('/login', showLoginPage);

// POST: Handle login form
router.post('/login', showLoginPageAutenticate );

// GET: Logout
router.get('/logout',loginPageLogOut);

module.exports = router;
