import express from "express";
import multer from "multer";
import { updateTeam } from "../teamStorage";
import { getUserCustomCrestFolderPath } from "../userPath";
import { validateFile } from "../utils";
import { storage, imageFilter } from "../multerConfig";
import { paths } from "./paths";

const uploadImage = multer({ storage, fileFilter: imageFilter });

const router = express.Router();

router.put("/:teamId", uploadImage.single("image"), (req: any, res: any) => {
  const { username } = req.session;
  const { teamId } = req.params;
  const { filename } = req.file;
  console.log(`User '${username}' uploaded new crest for team ${teamId}`);
  console.log(req.file);
  const crestUrl = paths.generateCustomCrestUrl(teamId, filename);
  const newData = {
    crestUrl,
    hasCustomCrest: true,
  };
  updateTeam(newData, username, teamId);
  res.status(200).json(crestUrl);
});

router.get("/:teamId/:filename", (req: any, res: any) => {
  const { username } = req.session;
  const { teamId, filename } = req.params;
  const imgPath = `${getUserCustomCrestFolderPath(username)}/${filename}`;
  console.log("sending img path: ", imgPath);
  if (!validateFile(imgPath)) {
    res.status(404).send("Crest not found");
  } else {
    res.sendFile(imgPath);
  }
});

export default router;
