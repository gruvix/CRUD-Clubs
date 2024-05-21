import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import TeamStorageAdapter from '@comp/Adapters/teamStorage.adapter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import Player from '@comp/entities/player.entity';
import PlayerData from '@comp/models/playerData';
import Team from '@comp/entities/team.entity';

const storage = new TeamStorageAdapter();
@Injectable()
export default class PlayerService {
  @InjectEntityManager() private readonly entityManager: EntityManager;

  async addPlayer(
    username: string,
    teamId: number,
    player: PlayerData,
  ): Promise<number | Error> {
    let newId: number;
    try {
      newId = storage.findNextFreePlayerId(
        (await storage.getTeam(username, teamId)).squad,
      );
      if (newId !== 0 && !newId) {
        throw new Error('Failed to add player, unkown server error');
      }
      player.id = newId;
      //await storage.addPlayer(username, teamId, player);
    } catch (error) {
      console.log(error);
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
    newData: PlayerData,
  ): Promise<void> {
    try {
      //await storage.updatePlayer(username, teamId, newData);
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to remove player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSquad(teamId: number): Promise<Player[]> {
    return (
      await this.entityManager.findOne(Team, {
        where: { id: teamId },
        relations: ['squad'],
      })
    ).squad;
  }

  copyPlayersToTeam(team: Team, players: Player[]): void {
    for (const player of players) {
      player.team = team.id;
      delete player.id;
      team.squad.push(player);
    }
  }

  async clearSquad(teamId: number): Promise<void> {
    try {
      await this.entityManager
        .createQueryBuilder()
        .delete()
        .from(Player)
        .where({ team: teamId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "server failed to clear team's squad",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
