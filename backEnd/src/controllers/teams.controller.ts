import { Controller, Get, Req, Res } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import { getTeamsList } from 'src/components/teamStorage';

interface TeamsData {
  username: string;
  teams: TeamExtended[];
}

@Controller('user/teams')
export class TeamsController {
  @Get()
  getTeamsList(@Req() req: Request & { session: any }): TeamsData {
    const { username } = req.session;
    console.log(`User ${username} requested teams list`);
    const data: TeamsData = {
      username, //Create custom endpoint to get username, remove username from other requests
      teams: getTeamsList(username),
    };
    return data;
  }
}
