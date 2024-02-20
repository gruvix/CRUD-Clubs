const express = require('express');
const { validateUsername } = require('../auth');

const router = express.Router();

router.get('/status', (req, res) => {
  const { username } = req.session;
  console.log(`User ${username} is requesting login status`);
  if (username) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});
router.post('/login', (req, res) => {
  const { username } = req.body;
  const error = validateUsername(username);
  if (error) {
    res.status(400).send(error);
    return;
  }
  req.session.username = username.toLowerCase();
  console.log(`User '${username}' logged in`);
  res.status(200).send();
});
router.post('/logout', (req, res) => {
  const { username } = req.session;
  try {
    req.session.destroy();
    console.log(`User '${username}' logged out`);
    res.status(200).send();
  } catch {
    res.status(401).send();
  }
});

module.exports = router;
