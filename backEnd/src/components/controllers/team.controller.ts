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
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import TeamData from '@comp/interfaces/TeamData.interface';
import { AuthGuard } from '@comp/guards/auth.guard';
import { TeamGuard } from '@comp/guards/team.guard';
import TeamService from '@comp/services/team.service';

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

    await this.teamService.updateTeam(teamId, data);
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
