import multer, { FileFilterCallback } from "multer";
import path from "path";
import { getUserCustomCrestFolderPath } from "./userPath";
import TeamStorageAdapter from "../teamStorage.adapter";
import { Request } from "express";

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(null, false);
  }
  cb(null, true);
};
const adapter = new TeamStorageAdapter();
const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const { username } = req.session;
    const userCrestsFolderPath = `${getUserCustomCrestFolderPath(username)}`;
    cb(null, userCrestsFolderPath);
  },
  filename: (req: any, file, cb) => {
    let { teamId } = req.params;
    if (!teamId) {
      const { username } = req.session;
      teamId = adapter.findNextFreeTeamId(username).toString();
    }
    const filename = `${teamId}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

export { imageFilter, storage };
