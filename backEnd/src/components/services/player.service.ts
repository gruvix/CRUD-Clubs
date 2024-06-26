import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Player from '@comp/entities/player.entity';
import Team from '@comp/entities/team.entity';
import PlayerData from '@comp/interfaces/PlayerData.interface';

@Injectable()
export default class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async addPlayer(teamId: number, newPlayerData: PlayerData): Promise<number> {
    try {
      const newPlayer = {
        ...newPlayerData,
        team: teamId,
      };
      delete newPlayer.id;
      const insertResult = await this.playerRepository
        .createQueryBuilder()
        .insert()
        .into(Player)
        .values(newPlayer)
        .execute();
      const newPlayerId = insertResult.raw;
      return newPlayerId;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to add player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updatePlayer(newData: PlayerData): Promise<void> {
    if (!newData.id)
      throw new HttpException('Missing player id', HttpStatus.BAD_REQUEST);
    try {
      await this.playerRepository
        .createQueryBuilder()
        .update(Player)
        .set(newData)
        .where('id = :id', { id: newData.id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to update player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async removePlayer(playerId: number): Promise<void> {
    if (!playerId)
      throw new HttpException('Missing player id', HttpStatus.BAD_REQUEST);
    try {
      await this.playerRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: playerId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to remove player',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  copyPlayersToTeam(team: Team, players: Player[]): void {
    if(!players) return;
    for (const player of players) {
      player.team = team.id;
      delete player.id;
      team.squad.push(player);
    }
  }

  async clearSquad(teamId: number): Promise<void> {
    if (!teamId) throw new Error('No team id provided');
    try {
      await this.playerRepository
        .createQueryBuilder()
        .delete()
        .from(Player)
        .where({ team: teamId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "Server failed to clear team's squad",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
