import { Controller, Get, HttpException, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import TeamExtended from 'src/components/models/TeamExtended';
import { AuthGuard } from 'src/components/guards/auth.guard';
import TeamsService from 'src/components/services/teams.service';

interface TeamsData {
  username: string;
  teams: TeamExtended[];
}

@UseGuards(AuthGuard)
@Controller('user/teams')
export default class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async getTeamsList(@Req() req: CustomRequest): Promise<TeamsData> {
    const { username } = req.session;
    console.log(`User ${username} requested teams list`);
    const data: TeamsData = {
      username, //Create custom endpoint to get username, remove username from other requests
      teams: await this.teamsService.getTeamsData(username),
    };
    return data;
  }

  @Put()
  async resetTeamsList(@Req() req: CustomRequest) {
    const { username } = req.session;
    console.log(`User ${username} requested teams list reset`);
    try {
      await this.teamsService.resetTeamsList(username);
    } catch (error) {
      throw new HttpException('Failed to get team', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
