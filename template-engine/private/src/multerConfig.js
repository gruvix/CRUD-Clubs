const multer = require('multer');
const path = require('path');
const { getUserCustomCrestFolderPath } = require('./userPath.js');
const { findNextFreeTeamId } = require('./teamStorage.js');

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error(`User tried to upload invalid image: ${file.mimetype}`), false);
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
      teamId = findNextFreeTeamId(username);
    }
    const filename = `${teamId}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

module.exports = { imageFilter, storage };
