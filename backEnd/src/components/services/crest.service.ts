import { Injectable } from '@nestjs/common';
import CrestStorageAdapter from '../Adapters/crestStorage.adapter';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';
import { generateCustomCrestUrl } from '../storage/userPath';

const crestStorage = new CrestStorageAdapter();
const teamStorage = new TeamStorageAdapter();

@Injectable()
export default class CrestService {

    getCrest(username: string, fileName: string): Buffer {
        return crestStorage.getCrest(username, fileName);
    }
    updateCrest(username: string, teamId: number | string, filename: string): string {
        crestStorage.deleteOldCrests(username, teamId, filename);
        const crestUrl = generateCustomCrestUrl(teamId, filename);
        const newData = {
            crestUrl,
            hasCustomCrest: true,
          };
          teamStorage.updateTeam(newData, username, teamId);
        return crestUrl
    }
}
