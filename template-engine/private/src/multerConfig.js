const multer = require('multer');
const imgTypes = require('../models/imgTypes.js');
const generateUserPath = require('./path.js');

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(imgTypes)) {
    return cb(new Error('this file type is not allowed'), false);
  }
  cb(null, true);
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { username } = req.session;
    const userPath = `${generateUserPath(username)}/upload`;
    cb(null, userPath);
  },
  filename: (req, file, cb) => {
    const { teamId } = req.params;
    cb(null, teamId);
  },
});

module.exports = { imageFilter, storage };
