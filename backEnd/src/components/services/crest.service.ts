import { Inject, Injectable } from '@nestjs/common';
import CrestStorageAdapter from '@comp/Adapters/crestStorage.adapter';
import { generateCustomCrestUrl } from '@comp/storage/userPath';
import TeamService from './team.service';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';

const crestStorage = new CrestStorageAdapter();
const teamStorage = new TeamStorageAdapter();

@Injectable()
export default class CrestService {
    constructor(
        @Inject(TeamService)
        private readonly teamService: TeamService,
    ) {}
    async getCrest(userId: number, fileName: string): Promise<Buffer> {
        return await crestStorage.getCrest(userId, fileName);
    }
    private async deleteCrest(teamId: number) {
        const crestRelatedProperties = ['crestFileName', 'hasCustomCrest', 'user'];
        const team = await this.teamService.getTeam(teamId, ['user'], crestRelatedProperties);
        const userId = (team.user as unknown as User).id

        if (team.hasCustomCrest) {
            await crestStorage.deleteCrest(userId, team.crestFileName);
        }
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
