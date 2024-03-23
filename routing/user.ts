import express, { Router, Request, Response } from 'express';
import { validateUsername } from '../backEnd/src/components/auth';
import { validateFile } from '../backEnd/src/components/Adapters/storage/dataStorage';
import { getUserTeamsListJSONPath } from '../backEnd/src/components/Adapters/storage/userPath';
import { createUser } from '../backEnd/src/components/Adapters/user.adapter';

const router: Router = express.Router();

router.get('/status', ( req: any, res: Response) => {
  const { username } = req.session;
  console.log(`User ${username} is requesting login status`);
  if (username) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});
router.post('/login', ( req: any, res: Response) => {
  const { username } = req.body;
  const error = validateUsername(username);
  if (error) {
    res.status(400).send(error);
    return;
  }
  if (!validateFile(getUserTeamsListJSONPath(username))) {
    console.log(`User not found, creating new user "${username}"`);
    try {
      createUser(username);
    } catch (error) { res.status(500).send(error); }
  }
  req.session.username = username.toLowerCase();
  console.log(`User '${username}' logged in`);
  res.status(200).send();
});
router.post('/logout', ( req: any, res: Response) => {
  const { username } = req.session;
  try {
    req.session.destroy();
    console.log(`User '${username}' logged out`);
    res.status(200).send();
  } catch {
    res.status(401).send();
  }
});

export default router;
