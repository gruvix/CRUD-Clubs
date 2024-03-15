import multer, { FileFilterCallback } from "multer";
import path from "path";
import { getUserCustomCrestFolderPath } from "./userPath";
import { findNextFreeTeamId } from "./teamStorage";
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.session;
    const userCrestsFolderPath = `${getUserCustomCrestFolderPath(username)}`;
    cb(null, userCrestsFolderPath);
  },
  filename: (req, file, cb) => {
    let { teamId } = req.params;
    if (!teamId) {
      const { username } = req.session;
      teamId = findNextFreeTeamId(username).toString();
    }
    const filename = `${teamId}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

export { imageFilter, storage };
