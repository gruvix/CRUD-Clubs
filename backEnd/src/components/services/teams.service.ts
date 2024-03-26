import { Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import TeamStorageAdapter from 'src/components/Adapters/teamStorage.adapter';
import UserStorageAdapter from '../Adapters/userStorage.adapter';

const userStorage = new UserStorageAdapter();
const teamsStorage = new TeamStorageAdapter();
@Injectable()
export default class TeamsService {
  getTeamsData(username: string): TeamExtended[] {
    const data: TeamExtended[] = teamsStorage.getTeamsList(username);
    return data;
  }

  resetTeamsList(username: string) {
    userStorage.resetUser(username);
  }
}
