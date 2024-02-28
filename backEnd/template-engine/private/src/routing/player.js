const express = require('express');
const { addPlayer, updatePlayer, removePlayer } = require('../teamStorage');

const router = express.Router();

router.route('/:teamId')
  .post((req, res) => {
    const { username } = req.session;
    const { teamId } = req.params;
    const { player } = req.body;
    console.log(`User ${username} added player ${player.name} to team ${teamId}`);
    try {
      const newId = addPlayer(username, teamId, player);
      console.log(`Added player ${newId} to team ${teamId}`);
      res.status(200).send(newId.toString());
    } catch (error) {
      console.log(error);
      res.status(400).send('Error adding player to team');
    }
  })
  .patch((req, res) => {
    const { username } = req.session;
    const { teamId } = req.params;
    const player = req.body;
    console.log(`User ${username} updated player ${player.id} in team ${teamId}`);
    try {
      updatePlayer(username, teamId, player);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(400).send('Error updating player in team');
    }
  })
  .delete((req, res) => {
    const { username } = req.session;
    const { teamId } = req.params;
    const { playerId } = req.body;
    console.log(`User ${username} is removing player ${playerId} from team ${teamId}`);
    try {
      removePlayer(username, teamId, playerId);
      res.status(204).send();
    } catch {
      res.status(400).send('Error removing player from team');
    }
  });

module.exports = router;
