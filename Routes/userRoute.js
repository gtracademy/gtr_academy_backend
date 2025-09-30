const express = require('express');
const router = express.Router();

// Hardcoded credentials
const USERNAME = 'admin';
const PASSWORD = 'Gtr@2025#';


router.get('/login', (req, res) => {
    res.render('login');
});



router.post('/login', (req, res) => {
    const { username, password } = req.query;
    console.log(username, password);
    if (username === USERNAME && password === PASSWORD) {
        res.send('Login successful');
    }
    else {
        res.status(401).send('Invalid username or password');
        res.send('Invalid username or password');
    }
}); 



module.exports = router;
