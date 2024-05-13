import {
  Controller,
  Patch,
  Get,
  Req,
  Param,
  Body,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import CustomRequest from 'src/components/interfaces/CustomRequest.interface';
import TeamData from 'src/components/interfaces/TeamData.interface';
import { AuthGuard } from 'src/components/guards/auth.guard';
import { TeamGuard } from 'src/components/guards/team.guard';
import TeamService from 'src/components/services/team.service';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId')
export default class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get()
  async getTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
  ): Promise<TeamData> {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} requested team ${teamId}`);

    return await this.teamService.getTeam(teamId);
  }

  @Patch()
  async updateTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: TeamData,
  ): Promise<void> {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} is updating team ${teamId}`);
    await this.teamService.updateTeamData(username, teamId, data);
  }

  @Delete()
  async deleteTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
  ): Promise<void> {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} is deleting team ${teamId}`);
    await this.teamService.deleteTeam(username, teamId);
  }

  @Put()
  async resetTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
  ): Promise<void> {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} is resetting team ${teamId}`);
    await this.teamService.resetTeam(username, teamId);
  }
}
