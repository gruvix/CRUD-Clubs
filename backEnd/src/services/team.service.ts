import { Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import { getTeam, hasTeamDefault, isTeamDefault, validateTeam } from 'src/components/teamStorage';

@Injectable()
export class TeamService {
  getTeamData(username: string, teamId: string | number): TeamExtended {
    if (!validateTeam(username, teamId)) {
        return null;
      }
      let team: TeamExtended;
      const teamDefaultBool = isTeamDefault(username, teamId);
      if (teamDefaultBool) {
        const defaultUsername = "default";
        team = getTeam(defaultUsername, teamId);
      } else {
        team = getTeam(username, teamId);
      }
      return new TeamExtended({
        ...team,
        isDefault: teamDefaultBool,
        hasDefault: hasTeamDefault(username, teamId),
      });
  }
}
