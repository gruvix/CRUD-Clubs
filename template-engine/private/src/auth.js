const ensureLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    console.log('user not logged in, redirecting to homepage');
    res.redirect(301, '/');
  }
};
module.exports = ensureLoggedIn;
