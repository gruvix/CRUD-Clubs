import express, { Router } from 'express';
import { getTeamsList } from '../teamStorage';
import TeamExtended from "../models/TeamExtended";
import use from '../interfaces/use';

interface TeamsData {
  username: string;
  teams: TeamExtended[];
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