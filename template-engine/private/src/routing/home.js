const express = require('express');

const router = express.Router();
router.get('/', (req, res) => {
  const { username } = req.session;
  if (username) {
    console.log(`User '${username}' requested landing page, redirecting to teams view`);
    res.redirect(302, '/user/teams');
    return;
  }
  res.render('home', {
    layout: 'main',
    data: {

    },
  });
});

module.exports = router;
