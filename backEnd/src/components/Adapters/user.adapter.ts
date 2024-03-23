import { createFolder, deleteFile } from './storage/dataStorage';
import { getUserRootPath, getUserTeamsFolderPath, getUserCustomCrestFolderPath } from './storage/userPath';
import TeamStorageAdapter from './teamStorage.adapter';

const teamStorage = new TeamStorageAdapter();
export function createUser(username: string) {
  try {
    createFolder(getUserRootPath(username));
    createFolder(getUserTeamsFolderPath(username));
    createFolder(getUserCustomCrestFolderPath(username));
    const defaultUsername = 'default';
    teamStorage.copyTeamList(defaultUsername, username);
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
