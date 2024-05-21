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
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import PlayerData from '@comp/models/playerData';
import { AuthGuard } from '@comp/guards/auth.guard';
import { TeamGuard } from '@comp/guards/team.guard';
import PlayerService from '@comp/services/player.service';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId/player')
export default class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async addPlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() newPlayer: PlayerData,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is adding player to team ${params.teamId}`);
    const newId = await this.playerService.addPlayer(username, params.teamId, newPlayer);
    return newId;
  }

  @Patch()
  async updatePlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() playerData: PlayerData,
  ) {
    const { username } = req.session;
    console.log(`User ${username} is updating team ${params.teamId}'s player ${playerData.id}`);
    await this.playerService.updatePlayer(username, params.teamId, playerData);
  }

  @Delete()
  async deletePlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() data: { playerId: number },
  ) {
    const { playerId } = data;
    const { username } = req.session;
    console.log(`User ${username} is deleting team ${params.teamId}'s player ${playerId}`);
    await this.playerService.removePlayer(username, params.teamId, playerId);
  }
}
