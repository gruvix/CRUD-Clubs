const ensureLoggedIn = (req, res, next) => {
  console.log(`Checking login status for User ${req.session.username}`);
  if (req.session.username) {
    console.log(`User ${req.session.username} is requesting ${req.path}`);
    next();
  } else {
    console.log('user not logged in');
    res.status(401).send();
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
