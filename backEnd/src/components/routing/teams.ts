import express, { Response, Router } from 'express';
import { getTeamsList } from '../Adapters/teamStorage.adapter';
import TeamExtended from "../models/TeamExtended";

interface TeamsData {
  username: string;
  teams: TeamExtended[];
}

const router: Router = express.Router();

router.get('', ( req: any, res: Response) => {
  const { username } = req.session;
  const data: TeamsData = {
    username,
    teams: getTeamsList(username),
  };
  res.json(data);
});

export default router;