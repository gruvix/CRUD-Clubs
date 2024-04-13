import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Player from 'src/components/models/Player';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';

const storage = new TeamStorageAdapter();
@Injectable()
export default class PlayerService {
  async addPlayer(
    username: string,
    teamId: number,
    player: Player,
  ): Promise<number | Error> {
    let newId: number;
    try {
      newId = storage.findNextFreePlayerId(
        (await storage.getTeam(username, teamId)).squad,
      );
      if (!newId) {
        throw new Error('Failed to add player, unkown server error');
      }
      player.id = newId;
      await storage.addPlayer(username, teamId, player);
    } catch {
      throw new HttpException(
        'Server failed to add player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newId;
  }
  async updatePlayer(
    username: string,
    teamId: number,
    newData: Player,
  ): Promise<void> {
    try {
      await storage.updatePlayer(username, teamId, newData);
    } catch {
      throw new HttpException(
        'Server failed to update player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async removePlayer(
    username: string,
    teamId: number,
    playerId: string | number,
  ): Promise<void> {
    try {
      await storage.removePlayer(username, teamId, playerId);
    } catch {
      throw new HttpException(
        'Server failed to remove player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
