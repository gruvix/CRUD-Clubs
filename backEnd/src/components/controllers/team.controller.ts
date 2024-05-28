import {
  Controller,
  Patch,
  Get,
  Body,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@comp/guards/auth.guard';
import { TeamGuard } from '@comp/guards/team.guard';
import TeamService from '@comp/services/team.service';
import { UserId } from '@comp/decorators/userId.decorator';
import { TeamId } from '@comp/decorators/teamId.decorator';
import TeamData from '@comp/interfaces/TeamData.interface';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId')
export default class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeam(
    @UserId() userId: number,
    @TeamId() teamId: number,
  ): Promise<TeamDTO> {
    console.log(`User ${userId} requested team ${teamId}`);
    const team = await this.teamService.getTeam(teamId);
    const teamDTO = this.teamService.transformTeamDataToDTO(team);
    return teamDTO;
  }

  @Patch()
  async updateTeam(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @Body() data: TeamData,
  ): Promise<void> {
    console.log(`User ${userId} is updating team ${teamId}`);

    await this.teamService.updateTeam(teamId, data);
  }

  @Delete()
  async deleteTeam(
    @UserId() userId: number,
    @TeamId() teamId: number,
  ): Promise<void> {
    console.log(`User ${userId} is deleting team ${teamId}`);
    await this.teamService.deleteTeam(teamId);
  }

  @Put()
  async resetTeam(
    @UserId() userId: number,
    @TeamId() teamId: number,
  ): Promise<void> {
    console.log(`User ${userId} is resetting team ${teamId}`);
    await this.teamService.resetTeam(teamId, userId);
  }
}
