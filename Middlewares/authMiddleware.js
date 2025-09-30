function adminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/user/login'); // redirect to login if not authenticated
  }
}

module.exports = adminAuth;
