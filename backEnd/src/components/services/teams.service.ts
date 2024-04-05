import { Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import TeamStorageAdapter from 'src/components/Adapters/teamStorage.adapter';
import UserStorageAdapter from '../Adapters/userStorage.adapter';
import TeamListTeam from '../models/TeamListTeam';

const userStorage = new UserStorageAdapter();
const teamsStorage = new TeamStorageAdapter();
@Injectable()
export default class TeamsService {
  async getTeamsData(username: string): Promise<TeamListTeam[]> {
    const data = await teamsStorage.getTeamsList(username);
    return data;
  }

  async resetTeamsList(username: string) {
    await userStorage.resetUser(username);
  }
}
