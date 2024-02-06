const express = require('express');
const { validateUsername } = require('../auth');
const { redirectPaths } = require('./paths');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username } = req.body;
  const error = validateUsername(username);
  if (error) {
    res.status(400).send(error);
    return;
  }
  req.session.username = username;
  console.log(`User '${username}' logged in`);
  res.redirect(302, redirectPaths.teams);
});
router.post('/logout', (req, res) => {
  const { username } = req.session;
  req.session.destroy();
  console.log(`User '${username}' logged out`);
  res.redirect(302, redirectPaths.home);
});

module.exports = router;
