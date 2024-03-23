import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Player from 'src/components/models/Player';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';

const storage = new TeamStorageAdapter();
@Injectable()
export default class PlayerService {
  addPlayer(
    username: string,
    teamId: string | number,
    player: Player,
  ): number | Error {
    let newId: number;
    try {
      newId = storage.addPlayer(username, teamId, player);
    } catch {
      throw new HttpException(
        'Server failed to add player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newId
      ? newId
      : new Error('Failed to add player, unkown server error');
  }
  updatePlayer(username: string, teamId: string | number, newData: Player) {
    try {
      storage.updatePlayer(username, teamId, newData);
    } catch {
      throw new HttpException(
        'Server failed to update player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  removePlayer(
    username: string,
    teamId: string | number,
    playerId: string | number,
  ) {
    try {
      storage.removePlayer(username, teamId, playerId);
    } catch {
      throw new HttpException(
        'Server failed to remove player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
