import {
  Controller,
  Patch,
  Req,
  Param,
  Body,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import CustomRequest from 'src/components/models/CustomRequest.interface';
import Player from 'src/components/models/Player';
import { AuthGuard } from 'src/components/guards/auth.guard';
import { TeamGuard } from 'src/components/guards/team.guard';
import PlayerService from 'src/components/services/player.service';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId/player')
export default class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  addPlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() newPlayer: Player,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is adding player to team ${params.teamId}`);
    const newId = this.playerService.addPlayer(username, params.teamId, newPlayer);
    return newId;
  }

  @Patch()
  updatePlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() playerData: Player,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is updating team ${params.teamId}'s player ${playerData.id}`);
    this.playerService.updatePlayer(username, params.teamId, playerData);
  }

  @Delete()
  deletePlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: { playerId: number },
  ) {
    const { playerId } = data;
    const { username } = req.session;
    console.log(`User ${username} is deleting team ${params.teamId}'s player ${playerId}`);
    this.playerService.removePlayer(username, params.teamId, playerId);
  }
}
