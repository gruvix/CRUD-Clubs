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
import { AuthGuard } from '@comp/guards/auth.guard';
import { TeamGuard } from '@comp/guards/team.guard';
import { PlayerGuard } from '@comp/guards/player.guard';
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
      console.log(error);
      throw new HttpException(
        'Failed to add player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @UseGuards(PlayerGuard)
  @Patch()
  async updatePlayer(
    @UserId() userId: number,
    @TeamId() teamId: number,
    @Body() playerData: PlayerData,
  ) {
    try {
      console.log(
        `User ${userId} is updating team ${teamId}'s player ${playerData.id}`,
      );
      await this.playerService.updatePlayer(playerData);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to update player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(PlayerGuard)
  @Delete()
  async deletePlayer(
    @UserId() userId: string,
    @TeamId() teamId: number,
    @Body() playerData: PlayerData,

  ) {
    console.log(
      `User ${userId} is deleting team ${teamId}'s player ${playerData.id}`,
    );
    await this.playerService.removePlayer(playerData.id);
  }
}
