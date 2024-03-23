import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import { AuthGuard } from 'src/guards/auth.guard';
import { TeamsService } from 'src/services/teams.service';

interface TeamsData {
  username: string;
  teams: TeamExtended[];
}

@Controller('user/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getTeamsList(@Req() req: Request & { session: any }): TeamsData {
    const { username } = req.session;
    console.log(`User ${username} requested teams list`);
    const data: TeamsData = {
      username, //Create custom endpoint to get username, remove username from other requests
      teams: this.teamsService.getTeamsData(username),
    };
    return data;
  }
}
