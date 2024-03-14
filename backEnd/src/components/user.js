const { copyTeamList } = require('./teamStorage');
const { createFolder, deleteFile } = require('./utils');
const { getUserRootPath, getUserTeamsFolderPath, getUserCustomCrestFolderPath } = require('./userPath');

function createUser(username) {
  try {
    console.log(`Creating new user ${username}`);
    console.log(getUserRootPath(username));
    console.log(getUserTeamsFolderPath(username));
    console.log(getUserCustomCrestFolderPath(username));


    createFolder(getUserRootPath(username));
    createFolder(getUserTeamsFolderPath(username));
    createFolder(getUserCustomCrestFolderPath(username));
    const defaultUsername = 'default';
    copyTeamList(defaultUsername, username);
  } catch (e) {
    throw new Error('Failed to create new user: ' + e);
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
