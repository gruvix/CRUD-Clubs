import {
  Controller,
  Patch,
  Req,
  Param,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import Player from 'src/components/models/Player';
import { AuthGuard } from 'src/guards/auth.guard';
import { TeamGuard } from 'src/guards/team.guard';
import PlayerService from 'src/services/player.service';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId/player')
export default class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  addPlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: Player,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is adding player to team ${params.teamId}`);
    const newId = this.playerService.newPlayer(username, params.teamId, data);
    return newId;
  }

  @Patch()
  updatePlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: Player,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is updating team ${params.teamId}`);
    this.playerService.updatePlayerData(username, params.teamId, data);
  }
}
