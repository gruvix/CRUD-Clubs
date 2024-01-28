const express = require('express');
const {
  validateTeam, isTeamDefault, getTeam, updateTeam, deleteTeam, addTeam,
} = require('../teamStorage');
const { getDomain } = require('../domain');
const Player = require('../../models/player');
const Team = require('../../models/team');
const paths = require('./paths');

const router = express.Router();

router.route('/add')
  .get((req, res) => {
    res.render('newTeam', {
      layout: 'main',
      data: {
        team: new Team({}),
      },
    });
  })
  .post((req, res) => {
    const { username } = req.session;
    const teamData = req.body;
    try {
      addTeam(username, teamData);
    } catch {
      res.status(400).send('Error adding team');
    }
  });

router.route('/:teamId')
  .get((req, res) => {
    const { teamId } = req.params;
    const { username } = req.session;
    console.log(`User ${username} requested team ${teamId}`);
    if (!validateTeam(username, teamId)) {
      res.redirect('/error?keyword=Team-not-found&code=404');
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
