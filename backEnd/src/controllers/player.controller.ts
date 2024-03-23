import {
    Controller,
    Patch,
    Req,
    Param,
    Body,
    UseGuards,
  } from '@nestjs/common';
import Player from 'src/components/models/Player';
  import { AuthGuard } from 'src/guards/auth.guard';
  import PlayerService from 'src/services/player.service';
  
  @UseGuards(AuthGuard)
  @Controller('user/team/:teamId/player')
  export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Patch()
    updateTeam(
      @Req() req: Request & { session: any },
      @Param() params: any,
      @Body() data: Player,
    ) {
      const { username } = req.session;
      console.log(`User ${username} is updating team ${params.teamId}`);
      this.playerService.updatePlayerData(username, params.teamId, data);
    }
  }
  