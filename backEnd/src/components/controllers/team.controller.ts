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
import CustomRequest from 'src/components/models/CustomRequest.interface';
import TeamData from 'src/components/models/TeamData.interface';
import TeamExtended from 'src/components/models/TeamExtended';
import { AuthGuard } from 'src/components/guards/auth.guard';
import { TeamGuard } from 'src/components/guards/team.guard';
import TeamService from 'src/components/services/team.service';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId')
export default class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeam(@Req() req: CustomRequest, @Param() params: any): Promise<TeamExtended> {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} requested team ${teamId}`);
    const data = await this.teamService.getTeamData(username, teamId);
    return data;
  }

  @Patch()
  updateTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: TeamData,
  ) {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} is updating team ${teamId}`);
    this.teamService.updateTeamData(username, teamId, data);
  }

  @Delete()
  deleteTeam(@Req() req: CustomRequest, @Param() params: any) {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} is deleting team ${teamId}`);
    this.teamService.deleteTeam(username, teamId);
  }

  @Put()
  resetTeam(@Req() req: CustomRequest, @Param() params: any) {
    const { username } = req.session;
    const { teamId } = params;
    console.log(`User ${username} is resetting team ${teamId}`);
    this.teamService.resetTeam(username, teamId);
  }
}
