import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@comp/guards/auth.guard';
import TeamsService from '@comp/services/teams.service';
import { UserId } from '@comp/decorators/userId.decorator';
import { Username } from '@comp/decorators/username.decorator';
import TeamShortDTO from '@comp/interfaces/TeamShortDTO.interface';

interface TeamsListData {
  username: string;
  teams: TeamShortDTO[];
}

@UseGuards(AuthGuard)
@Controller('user/teams')
export default class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async getTeamsList(
    @UserId() userId: number,
    @Username() username: string,
  ): Promise<TeamsListData> {
    console.log(`User ${userId} requested teams list`);
    try {
      const data: TeamsListData = {
        username, //Create custom endpoint to get username, remove username from other requests
        teams: await this.teamsService.getTeamsList(userId),
      };
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to get teams',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  async resetTeams(@UserId() userId: number) {
    console.log(`User ${userId} requested teams list reset`);
    try {
      await this.teamsService.resetTeams(userId);
    } catch (error) {
      throw new HttpException(
        'Failed to reset teams',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
