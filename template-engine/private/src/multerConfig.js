const multer = require('multer');
const generateUserPath = require('./path.js');

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
    const userPath = `${generateUserPath(username)}/upload`;
    cb(null, userPath);
  },
  filename: (req, file, cb) => {
    const { teamId } = req.params;
    cb(null, teamId);
  },
});

module.exports = { imageFilter, storage };
