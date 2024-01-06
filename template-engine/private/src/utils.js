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
  return JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
}
module.exports = {
  deleteFile,
  copyFile,
  writeFile,
  readFile,
};
