import express from "express";
import { deleteUser, createUser } from "../Adapters/user.adapter";
import { validateFile } from "../Adapters/storage/dataStorage";
import { getUserTeamsListJSONPath } from "../Adapters/storage/userPath";
import { deleteTeam, cloneTeamFromDefault, copyTeamListTeam, hasTeamDefault } from "../Adapters/teamStorage.adapter";

const router = express.Router();

router.put("/all", (req: any, res: any) => {
  const { username } = req.session;
  console.log(`Resetting user ${username}`);
  try {
    deleteUser(username);
    if (!validateFile(getUserTeamsListJSONPath(username))) {
      createUser(username);
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).send("Error resetting teams");
  }
});

router.put("/:teamId", (req: any, res: any) => {
  const { username } = req.session;
  const { teamId } = req.params;
  console.log(`Resetting team ${teamId} from ${username}`);
  try {
    if (!hasTeamDefault(username, teamId)) {
      throw new Error("Team is not resettable");
    }
    deleteTeam(username, teamId);
    const defaultUsername = "default";
    cloneTeamFromDefault(username, teamId);
    copyTeamListTeam(defaultUsername, username, teamId);

    res.status(204).send();
  } catch (error) {
    res.status(400).send(`Error resetting team ${teamId} from ${username}`);
  }
});

export default router;
