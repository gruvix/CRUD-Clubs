import * as multer from 'multer';
import * as path from 'path';
import { getUserCustomCrestFolderPath } from './userPath';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';
import { Request } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new HttpException(
      'Invalid filetype uploaded. Only jpeg, jpg, png and gif files are allowed.',
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    );
    return cb(error);
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
  filename: async (req: any, file, cb) => {
    let { teamId } = req.params;
    if (!teamId) {
      const { username } = req.session;
      teamId = (
        await adapter.findNextFreeTeamId(await adapter.getTeamsList(username))
      ).toString();
    }
    const filename = `${teamId}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const multerOptions: MulterOptions = {
  storage,
  fileFilter: imageFilter,
};
export default multerOptions;
