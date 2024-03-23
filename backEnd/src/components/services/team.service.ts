import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import {
  getTeam,
  hasTeamDefault,
  isTeamDefault,
  updateTeam,
  validateTeam,
} from 'src/components/Adapters/teamStorage.adapter';

@Injectable()
export default class TeamService {
  getTeamData(username: string, teamId: string | number): TeamExtended {
    let team: TeamExtended;
    const teamDefaultBool = isTeamDefault(username, teamId);
    try {
      if (teamDefaultBool) {
        const defaultUsername = 'default';
        team = getTeam(defaultUsername, teamId);
      } else {
        team = getTeam(username, teamId);
      }
    } catch (error) {
      throw new HttpException('Failed to get team' + error, HttpStatus.BAD_REQUEST);
    }
    return new TeamExtended({
      ...team,
      isDefault: teamDefaultBool,
      hasDefault: hasTeamDefault(username, teamId),
    });
  }

  updateTeamData(
    username: string,
    teamId: string | number,
    newData: { [key: string]: string | number | boolean },
  ) {
    try {
      updateTeam(newData, username, teamId);
    } catch {
      throw new HttpException(
        'Server failed to update team',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
