import { copyTeamList } from './teamStorage';
import { createFolder, deleteFile } from './utils';
import { getUserRootPath, getUserTeamsFolderPath, getUserCustomCrestFolderPath } from './userPath';

export function createUser(username: string) {
  try {
    createFolder(getUserRootPath(username));
    createFolder(getUserTeamsFolderPath(username));
    createFolder(getUserCustomCrestFolderPath(username));
    const defaultUsername = 'default';
    copyTeamList(defaultUsername, username);
  } catch (e) {
    throw new Error('Failed to create new user: ' + e);
  }
}
export function deleteUser(username: string) {
  try {
    deleteFile(getUserRootPath(username));
  } catch {
    throw new Error('Failed to delete user');
  }
}
