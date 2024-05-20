import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import { AuthGuard } from '@comp/guards/auth.guard';
import TeamsService from '@comp/services/teams.service';
import TeamListTeam from '@comp/models/TeamListTeam';
import UserService from '@comp/services/user.service';
import UserNotFoundError from '@comp/errors/UserNotFoundError';

interface TeamsListData {
  username: string;
  teams: TeamListTeam[];
}

@UseGuards(AuthGuard)
@Controller('user/teams')
export default class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async getTeamsList(@Req() req: CustomRequest): Promise<TeamsListData> {
    const { username, userId } = req.session;
    console.log(`User ${username} requested teams list`);
    try {
      const data: TeamsListData = {
        username, //Create custom endpoint to get username, remove username from other requests
        teams: await this.teamsService.getTeamsList(userId),
      };
      return data;
    } catch (error) {
      if (error)
        throw new HttpException(
          'Failed to get teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  @Put()
  async resetTeamsList(@Req() req: CustomRequest) {
    const { userId } = req.session;
    console.log(`User ${userId} requested teams list reset`);
    try {
      await this.teamsService.resetTeamsList(userId);
    } catch (error) {
      throw new HttpException(
        'Failed to reset teams',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
