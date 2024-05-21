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
import { UserId } from '@comp/decorators/userId.decorator';
import TeamDTO from '@comp/models/teamDTO.class';

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
  ): Promise<TeamDTO> {
    const { userId } = req.session;
    const { teamId } = params;
    console.log(`User ${userId} requested team ${teamId}`);
    return await this.teamService.getTeam(teamId);
  }

  @Patch()
  async updateTeam(
    @Param() params: any,
    @Body() data: TeamData,
    @UserId() userId: number,
  ): Promise<void> {
    const { teamId } = params;
    console.log(`User ${userId} is updating team ${teamId}`);

    await this.teamService.updateTeam(teamId, data);
  }

  @Delete()
  async deleteTeam(
    @Param() params: any,
    @UserId() userId: number,
  ): Promise<void> {
    const { teamId } = params;
    console.log(`User ${userId} is deleting team ${teamId}`);
    await this.teamService.deleteTeam(teamId);
  }

  @Put()
  async resetTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
  ): Promise<void> {
    const { userId } = req.session;
    const { teamId } = params;
    console.log(`User ${userId} is resetting team ${teamId}`);
    await this.teamService.resetTeam(teamId);
  }
}
