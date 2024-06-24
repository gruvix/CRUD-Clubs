import * as multer from 'multer';
import { getUserRootPath } from './userPath';
import { Request } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createFolder, validateFile } from './dataStorage';

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
const storage = multer.diskStorage({
  destination: async (req: any, file, cb) => {
    const { userId } = req.session;
    const userCrestsFolderPath = `${getUserRootPath(userId)}`;
    if(!await validateFile(userCrestsFolderPath)) {createFolder(userCrestsFolderPath);}
    cb(null, userCrestsFolderPath);
  },
});

const multerOptions: MulterOptions = {
  storage,
  fileFilter: imageFilter,
};
export default multerOptions;
