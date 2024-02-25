const express = require('express');
const { deleteUser, createUser } = require('../user');
const { validateFile } = require('../utils');
const { getUserTeamsListJSONPath } = require('../userPath');
const {
  deleteTeam, cloneTeamFromDefault, copyTeamListTeam, hasTeamDefault,
} = require('../teamStorage');

const router = express.Router();

router.put('/all', (req, res) => {
  const { username } = req.session;
  console.log(`Resetting user ${username}`);
  try {
    deleteUser(username);
    if (!validateFile(getUserTeamsListJSONPath(username))) {
      createUser(username);
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).send('Error resetting teams');
  }
});

router.put('/:teamId', (req, res) => {
  const { username } = req.session;
  const { teamId } = req.params;
  console.log(`Resetting team ${teamId} from ${username}`);
  try {
    if (!hasTeamDefault(username, teamId)) {
      throw new Error('Team is not resettable');
    }
    deleteTeam(username, teamId);
    const defaultUsername = 'default';
    cloneTeamFromDefault(username, teamId);
    copyTeamListTeam(defaultUsername, username, teamId);

    res.status(204).send();
  } catch (error) {
    res.status(400).send(`Error resetting team ${teamId} from ${username}`);
  }
});

module.exports = router;
