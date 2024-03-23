import {
    Controller,
    Patch,
    Req,
    Param,
    Body,
    UseGuards,
    Post,
  } from '@nestjs/common';
import Player from 'src/components/models/Player';
  import { AuthGuard } from 'src/guards/auth.guard';
  import PlayerService from 'src/services/player.service';
  
  @UseGuards(AuthGuard)
  @Controller('user/team/:teamId/player')
  export default class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Post()
    addPlayer(
      @Req() req: Request & { session: any },
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
      @Req() req: Request & { session: any },
      @Param() params: any,
      @Body() data: Player,
    ) {
      const { username } = req.session;
      console.log(`User ${username} is updating team ${params.teamId}`);
      this.playerService.updatePlayerData(username, params.teamId, data);
    }
  }
  