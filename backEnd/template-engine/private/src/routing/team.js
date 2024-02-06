const express = require('express');
const multer = require('multer');
const {
  validateTeam, isTeamDefault, getTeam, updateTeam, deleteTeam, addTeam, hasTeamDefault,
} = require('../teamStorage');
const { getDomain } = require('../domain');
const Player = require('../../models/player');
const Team = require('../../models/team');
const { redirectPaths, paths } = require('./paths');
const { storage, imageFilter } = require('../multerConfig.js');

const uploadImage = multer({ storage, fileFilter: imageFilter });
const router = express.Router();
router.route('/add')
  .get((req, res) => {
    res.render('newTeam', {
      layout: 'main',
      data: {
        team: new Team({}),
        addTeamPath: paths.addTeam,
      },
    });
  })
  .post(uploadImage.single('image'), (req, res) => {
    const { username } = req.session;
    const { teamData } = req.body;
    const { filename } = req.file;
    const team = JSON.parse(teamData);
    try {
      const id = addTeam(username, team, filename);
      res.redirect(302, redirectPaths.generateTeamUrl(id));
    } catch (error) {
      console.log(`Error adding team: ${error}`);
      res.status(400).send('Error adding team');
    }
  });

router.route('/:teamId')
  .get((req, res) => {
    const { teamId } = req.params;
    const { username } = req.session;
    console.log(`User ${username} requested team ${teamId}`);
    if (!validateTeam(username, teamId)) {
      res.redirect(`${redirectPaths.error}?keyword=Team-${teamId}-not-found&code=404`);
      return;
    }
    let team;
    const teamDefaultBool = isTeamDefault(username, teamId);
    if (teamDefaultBool) {
      console.log(`Team ${teamId} from user '${username}' is default`);
      const defaultUsername = 'default';
      team = getTeam(defaultUsername, teamId);
    } else {
      team = getTeam(username, teamId);
    }

    const players = [];
    if (Array.isArray(team.squad)) {
      team.squad.forEach((player) => {
        players.push(new Player(player));
      });
    } else {
      players.push(new Player(team.squad));
    }

    const domain = getDomain(req);
    res.render('teamEditor', {
      layout: 'main',
      data: {
        username,
        team: new Team(team, teamDefaultBool),
        crest: team.crestUrl,
        id: team.id,
        players,
        domain,
        hasDefault: hasTeamDefault(username, teamId),
        hasCustomCrest: team.hasCustomCrest,
        resetTeamPath: paths.resetSingle,
        teamsPath: paths.teams,
        crestPath: paths.crest,
        playerPath: paths.player,
        teamPath: paths.team,
      },
    });
  })
  .patch((req, res) => {
    const { teamId } = req.params;
    const { username } = req.session;
    console.log(`User ${username} updated team ${teamId}`);

    try {
      const updatedData = req.body;
      updateTeam(updatedData, username, teamId);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(400).send('Error updating team parameter');
    }
  })
  .delete((req, res) => {
    const { username } = req.session;
    const { teamId } = req.params;
    try {
      deleteTeam(username, teamId);
      res.status(204).send();
    } catch (error) {
      res.status(400).send('Error deleting team');
    }
  });

module.exports = router;
