const express = require('express');
const multer = require('multer');
const { updateTeam } = require('../teamStorage');
const { getUserCustomCrestFolderPath } = require('../userPath');
const { validateFile } = require('../utils');
const { storage, imageFilter } = require('../multerConfig.js');
const { paths } = require('./paths');

const uploadImage = multer({ storage, fileFilter: imageFilter });

const router = express.Router();

router.put('/:teamId', uploadImage.single('image'), (req, res) => {
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
  res.status(200).send(crestUrl);
});

router.get('/:teamId/:filename', (req, res) => {
  const { username } = req.session;
  const { teamId, filename } = req.params;
  const imgPath = `${getUserCustomCrestFolderPath(username, teamId)}/${filename}`;
  if (!validateFile(imgPath)) {
    res.status(404).send('Crest not found');
  } else {
    res.sendFile(imgPath, { root: '.' });
  }
});

module.exports = router;
