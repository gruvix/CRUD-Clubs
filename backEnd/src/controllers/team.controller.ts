import {
  Controller,
  Patch,
  Get,
  Req,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import TeamData from 'src/components/models/TeamData.interface';
import TeamExtended from 'src/components/models/TeamExtended';
import { AuthGuard } from 'src/guards/auth.guard';
import TeamService from 'src/services/team.service';

@UseGuards(AuthGuard)
@Controller('user/team')
export default class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get(':teamId')
  getTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
  ): TeamExtended {
    const { username } = req.session;
    console.log(`User ${username} requested team ${params.teamId}`);
    const data: TeamExtended = this.teamService.getTeamData(
      username,
      params.teamId,
    );
    return data;
  }

  @Patch(':teamId')
  updateTeam(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: TeamData,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is updating team ${params.teamId}`);
    this.teamService.updateTeamData(username, params.teamId, data);
  }
}
