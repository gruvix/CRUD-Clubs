const fs = require('fs');

function deleteFile(userPath) {
  fs.rmSync(userPath, { recursive: true, force: true });
}
function copyFile(sourcePath, targetPath) {
  fs.copyFileSync(sourcePath, targetPath);
}
function writeFile(targetPath, content) {
  fs.writeFileSync(targetPath, content);
}
/**
 * @returns - JSON object
 */
function readFile(targetPath) {
  try {
    const content = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    return content;
  } catch (err) {
    throw new Error(err);
  }
}
function validateFile(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
function createFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, (createFolderError) => {
        if (createFolderError) {
          console.log(createFolderError);
        }
        console.log('User folder created');
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
module.exports = {
  deleteFile,
  copyFile,
  writeFile,
  readFile,
  validateFile,
  createFolder,
};
