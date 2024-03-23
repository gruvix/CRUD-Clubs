import { Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import { getTeamsList } from 'src/components/teamStorage';

@Injectable()
export class TeamsService {
  getTeamsData(username: string): TeamExtended[] {
    const data: TeamExtended[] = getTeamsList(username);
    return data;
  }
}
