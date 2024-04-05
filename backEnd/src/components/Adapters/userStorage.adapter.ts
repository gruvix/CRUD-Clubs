import { createFolder, deleteFile, validateFile } from '../storage/dataStorage';
import {
  getUserRootPath,
  getUserTeamsFolderPath,
  getUserCustomCrestFolderPath,
  getUserTeamsListJSONPath,
} from '../storage/userPath';
import TeamStorageAdapter from './teamStorage.adapter';

const teamStorage = new TeamStorageAdapter();
export default class UserStorageAdapter {
  async createUser(username: string): Promise<void> {
    try {
      const defaultUsername = 'default';
      await Promise.all([
        createFolder(getUserRootPath(username)),
        createFolder(getUserTeamsFolderPath(username)),
        createFolder(getUserCustomCrestFolderPath(username)),
        teamStorage.copyTeamList(defaultUsername, username),
      ]);
    } catch (e) {
      throw new Error('Failed to create new user: ' + e);
    }
  }
  async deleteUser(username: string): Promise<void> {
    try {
      await deleteFile(getUserRootPath(username));
    } catch {
      throw new Error('Failed to delete user');
    }
  }
  async userExists(username: string): Promise<boolean | Error> {
    if (!await validateFile(getUserTeamsListJSONPath(username))) {
      return false;
    }
    return true;
  }
  async resetUser(username: string): Promise<void> {
    await Promise.all([this.deleteUser(username), this.createUser(username)]);
  }
}
