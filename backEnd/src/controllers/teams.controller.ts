import { Controller, Get, Req, Res } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import { getTeamsList } from 'src/components/teamStorage';

interface TeamsData {
  username: string;
  teams: TeamExtended[];
}

@Controller('teams')
export class TeamsController {
  @Get()
  getTeamsList(@Req() req: Request & { session: any }, @Res() res: Response): TeamsData {
    const { username } = req.session;
    const data: TeamsData = {
      username, //Create custom endpoint to get username, remove username from other requests
      teams: getTeamsList(username),
    };
    return data;
  }
}
