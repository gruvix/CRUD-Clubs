const express = require('express');
const { validateFile } = require('../utils');
const { getUserTeamsListJSONPath } = require('../userPath');
const { createUser } = require('../user');
const { getTeamsList } = require('../teamStorage');

const router = express.Router();
router.get('', (req, res) => {
  const { username } = req.session;
  if (!validateFile(getUserTeamsListJSONPath(username))) {
    console.log(`User not found, creating new user "${username}"`);
    createUser(username);
  }
  const data = {
    username,
    teams: getTeamsList(username),
  };
  res.json(data);
});

module.exports = router;
