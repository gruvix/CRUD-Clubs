const express = require('express');
const { getTeamsList } = require('../teamStorage');

const router = express.Router();
router.get('', (req, res) => {
  const { username } = req.session;
  const data = {
    username,
    teams: getTeamsList(username),
  };
  res.json(data);
});

module.exports = router;
