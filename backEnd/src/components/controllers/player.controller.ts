import {
  Controller,
  Patch,
  Req,
  Param,
  Body,
  UseGuards,
  Post,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import PlayerDataOld from '@comp/models/playerData.old';
import { AuthGuard } from '@comp/guards/auth.guard';
import { TeamGuard } from '@comp/guards/team.guard';
import PlayerService from '@comp/services/player.service';
import { UserId } from '@comp/decorators/userId.decorator';
import { TeamId } from '@comp/decorators/teamId.decorator';
import PlayerData from '@comp/interfaces/PlayerData.interface';

@UseGuards(AuthGuard, TeamGuard)
@Controller('user/team/:teamId/player')
export default class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async addPlayer(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @Body() newPlayer: PlayerData,
  ) {
    try {
      console.log(`User ${userId} is adding player to team ${teamId}`);
      const newId = await this.playerService.addPlayer(teamId, newPlayer);
      return newId;
    } catch (error) {
      throw new HttpException(
        'Failed to add player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch()
  async updatePlayer(
    @Req() req: CustomRequest,
    @Param() params: any,
    @Body() playerData: PlayerDataOld,
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
