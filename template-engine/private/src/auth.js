const ensureLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    console.log('user not logged in, redirecting to homepage');
    res.redirect(302, '/');
  }
};
function validateUsername(username) {
  const regexLettersWithNoDefault = /^[^\W\d_](?!default$)[^\W\d_]*$/i;
  if (!regexLettersWithNoDefault.test(username)) {
    return 'Invalid username';
  }
  return '';
}

module.exports = { ensureLoggedIn, validateUsername };
