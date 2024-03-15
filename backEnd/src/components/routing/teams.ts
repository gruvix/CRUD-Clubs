import express, { Router } from 'express';
import { getTeamsList } from '../teamStorage';
import TeamFullData from "../models/teamFullData";
import use from '../interfaces/use';

interface TeamsData {
  username: string;
  teams: TeamFullData[];
}

const router: Router = express.Router();

router.get('', ({req, res}: use) => {
  const { username } = req.session;
  const data: TeamsData = {
    username,
    teams: getTeamsList(username),
  };
  res.json(data);
});

export default router;