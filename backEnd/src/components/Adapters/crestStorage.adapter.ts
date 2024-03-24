import { deleteFile, readFile } from "../storage/dataStorage";
import { getUserCustomCrestFolderPath } from "../storage/userPath";
import TeamStorageAdapter from "./teamStorage.adapter";

const teamStorage = new TeamStorageAdapter();
export default class CrestStorageAdapter {
    getCrest(username: string, filename: string): Buffer {
        const imgPath = `${getUserCustomCrestFolderPath(username)}/${filename}`;
        const file = readFile(imgPath);
        return file;
    }
    /**
     * Deletes old crest if it is different from the new one
    */
    deleteOldCrest(username: string, teamId: number | string, newCrestFilename: string) {
        const team = teamStorage.getTeam(username, teamId);
        const oldCrestFilename = team.crestUrl.split('/').pop();
        if (oldCrestFilename !== newCrestFilename) {
            try {
                const oldCrestPath = `${getUserCustomCrestFolderPath(username)}/${oldCrestFilename}`;
                deleteFile(oldCrestPath);
            } catch (error) {
                throw error;
            }
        }
    }
}
