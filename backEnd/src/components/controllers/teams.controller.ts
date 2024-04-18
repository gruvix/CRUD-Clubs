import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import { AuthGuard } from 'src/components/guards/auth.guard';
import TeamsService from 'src/components/services/teams.service';
import TeamListTeam from '../models/TeamListTeam';

interface TeamsData {
  username: string;
  teams: TeamListTeam[];
}

@UseGuards(AuthGuard)
@Controller('user/teams')
export default class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async getTeamsList(@Req() req: CustomRequest): Promise<TeamsData> {
    const { username } = req.session;
    console.log(`User ${username} requested teams list`);
    try {
      const data: TeamsData = {
        username, //Create custom endpoint to get username, remove username from other requests
        teams: await this.teamsService.getTeamsData(username),
      };
      return data;
    } catch (error) {
      if(error)
      throw new HttpException(
        'Failed to get teams',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  async resetTeamsList(@Req() req: CustomRequest) {
    const { username } = req.session;
    console.log(`User ${username} requested teams list reset`);
    try {
      await this.teamsService.resetTeamsList(username);
    } catch (error) {
      throw new HttpException(
        'Failed to reset teams',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
