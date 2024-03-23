import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Player from 'src/components/models/Player';
import {
  addPlayer,
  updatePlayer,
  validateTeam,
} from 'src/components/teamStorage';

@Injectable()
export default class PlayerService {
  newPlayer(username: string, teamId: string | number, player: Player) {
    let newId: number;
    if (!validateTeam(username, teamId)) {
      throw new HttpException('Team not found', HttpStatus.BAD_REQUEST);
    }
    try {
      newId = addPlayer(username, teamId, player);
    } catch {
      throw new HttpException(
        'Server failed to add player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  updatePlayerData(username: string, teamId: string | number, newData: Player) {
    if (!validateTeam(username, teamId)) {
      throw new HttpException('Team not found', HttpStatus.BAD_REQUEST);
    }
    try {
      updatePlayer(username, teamId, newData);
    } catch {
      throw new HttpException(
        'Server failed to update player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
