import { deleteFile, readFile } from '../storage/dataStorage';
import { getUserCustomCrestFolderPath } from '../storage/userPath';
import TeamStorageAdapter from './teamStorage.adapter';

const teamStorage = new TeamStorageAdapter();
export default class CrestStorageAdapter {
  async getCrest(username: string, filename: string): Promise<Buffer> {
    const imgPath = `${getUserCustomCrestFolderPath(username)}/${filename}`;
    const file = await readFile(imgPath);
    return file;
  }
  /**
   * Deletes the old crest if it is different from the new one
   */
  async deleteOldCrest(
    username: string,
    teamId: number | string,
    newCrestFilename: string,
  ) {
    if (teamStorage.isTeamDefault(username, teamId)) return;
    const team = teamStorage.getTeam(username, teamId);
    const oldCrestFilename = team.crestUrl.split('/').pop();
    if (oldCrestFilename !== newCrestFilename) {
      try {
        const oldCrestPath = `${getUserCustomCrestFolderPath(username)}/${oldCrestFilename}`;
        await deleteFile(oldCrestPath);
      } catch (error) {
        throw error;
      }
    }
  }
}
