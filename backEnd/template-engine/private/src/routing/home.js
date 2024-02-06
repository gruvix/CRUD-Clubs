const express = require('express');

const { redirectPaths, paths } = require('./paths.js');

const router = express.Router();
router.get('', (req, res) => {
  const { username } = req.session;
  if (username) {
    console.log(`User '${username}' requested landing page, redirecting to teams view`);
    res.redirect(302, redirectPaths.teams);
    return;
  }
  res.render('home', {
    layout: 'main',
    data: {
      loginPath: paths.login,
    },
  });
});

module.exports = router;
