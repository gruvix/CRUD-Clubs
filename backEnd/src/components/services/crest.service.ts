import { Injectable } from '@nestjs/common';
import CrestStorageAdapter from '../Adapters/crestStorage.adapter';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';
import { generateCustomCrestUrl } from '../storage/userPath';

const crestStorage = new CrestStorageAdapter();
const teamStorage = new TeamStorageAdapter();

@Injectable()
export default class CrestService {

    async getCrest(username: string, fileName: string): Promise<Buffer> {
        return await crestStorage.getCrest(username, fileName);
    }
    async updateCrest(username: string, teamId: number | string, filename: string): Promise<string> {
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
