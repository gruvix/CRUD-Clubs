const { createFolder, deleteFile, copyTeamList } = require('./teamStorage');
const { getUserRootPath, getUserTeamsFolderPath, getUserCustomCrestFolderPath } = require('./userPath');

function createUser(username) {
  try {
    createFolder(getUserRootPath(username));
    createFolder(getUserTeamsFolderPath(username));
    createFolder(getUserCustomCrestFolderPath(username));
    const defaultUsername = 'default';
    copyTeamList(defaultUsername, username);
  } catch {
    throw new Error('Failed to create new user');
  }
}
function deleteUser(username) {
  try {
    deleteFile(getUserRootPath(username));
  } catch {
    throw new Error('Failed to delete user');
  }
}

module.exports = { createUser, deleteUser };
