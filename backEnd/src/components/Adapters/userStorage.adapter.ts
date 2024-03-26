import { createFolder, deleteFile, validateFile } from '../storage/dataStorage';
import { getUserRootPath, getUserTeamsFolderPath, getUserCustomCrestFolderPath, getUserTeamsListJSONPath } from '../storage/userPath';
import TeamStorageAdapter from './teamStorage.adapter';

const teamStorage = new TeamStorageAdapter();
export default class UserStorageAdapter {
  createUser(username: string) {
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
  deleteUser(username: string) {
    try {
      deleteFile(getUserRootPath(username));
    } catch {
      throw new Error('Failed to delete user');
    }
  }
  }
}
