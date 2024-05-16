import { Injectable } from '@nestjs/common';
import CrestStorageAdapter from '@comp/Adapters/crestStorage.adapter';
import TeamStorageAdapter from '@comp/Adapters/teamStorage.adapter';
import { generateCustomCrestUrl } from '@comp/storage/userPath';

const crestStorage = new CrestStorageAdapter();
const teamStorage = new TeamStorageAdapter();

@Injectable()
export default class CrestService {

    async getCrest(username: string, fileName: string): Promise<Buffer> {
        return await crestStorage.getCrest(username, fileName);
    }
    async updateCrest(username: string, teamId: number, filename: string): Promise<string> {
        crestStorage.deleteOldCrest(username, teamId, filename);
        const crestUrl = generateCustomCrestUrl(teamId, filename);
        const newData = {
            crestUrl,
            hasCustomCrest: true,
          };
          await teamStorage.updateTeam(newData, username, teamId);
        return crestUrl
    }
}
