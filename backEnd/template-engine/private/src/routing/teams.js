const express = require('express');
const { validateFile } = require('../utils');
const { getUserTeamsListJSONPath } = require('../userPath');
const { createUser } = require('../user');
const { getTeamsList } = require('../teamStorage');
const { getDomain } = require('../domain');
const paths = require('./paths');

const router = express.Router();
router.get('', (req, res) => {
  const { username } = req.session;
  if (!validateFile(getUserTeamsListJSONPath(username))) {
    console.log(`User not found, creating new user "${username}"`);
    createUser(username);
  }
  const teams = getTeamsList(username);
  const domain = getDomain(req);
  res.render('teams', {
    layout: 'main',
    data: {
      username,
      capitalizedName: username.charAt(0).toUpperCase() + username.slice(1),
      teams,
      domain,
      userPath: paths.user,
      logoutPath: paths.logout,
      teamPath: paths.team,
      addTeamPath: paths.addTeam,
      resetTeamsPath: paths.resetAll,
    },
  });
});

module.exports = router;
