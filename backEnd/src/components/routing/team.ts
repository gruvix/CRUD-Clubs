import express from 'express';
import multer from 'multer';
import { validateTeam, isTeamDefault, getTeam, updateTeam, deleteTeam, addTeam, hasTeamDefault } from '../teamStorage';
import { storage, imageFilter } from '../multerConfig';
import TeamFullData from '../models/teamFullData';
import use from "../interfaces/use";

const uploadImage = multer({ storage, fileFilter: imageFilter });
const router = express.Router();
router.route('/add')
  .post(uploadImage.single('image'), ({req, res}: use) => {
    const { username } = req.session;
    console.log(`User ${username} is adding a new team`);
    const { teamData } = req.body;
    const { filename } = req.file;
    const team = JSON.parse(teamData);
    try {
      const id = addTeam(username, team, filename);
      res.status(200).send(id.toString());
    } catch (error) {
      console.log(`Error adding team: ${error}`);
      res.status(400).send('Error adding team');
    }
  });

router.route('/:teamId')
  .get(({req, res}: use) => {
    const { teamId } = req.params;
    const { username } = req.session;
    console.log(`User ${username} requested team ${teamId}`);
    if (!validateTeam(username, teamId)) {
      res.status(404).send();
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
    res.json(new TeamFullData(team, teamDefaultBool, hasTeamDefault(username, teamId)));
  })
  .patch(({req, res}: use) => {
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
  .delete(({req, res}: use) => {
    const { username } = req.session;
    const { teamId } = req.params;
    try {
      deleteTeam(username, teamId);
      res.status(204).send();
    } catch (error) {
      res.status(400).send('Error deleting team');
    }
  });

export default router;
