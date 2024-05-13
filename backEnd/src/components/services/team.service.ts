import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import TeamStorageAdapter from 'src/components/Adapters/teamStorage.adapter';
import TeamIsNotResettableError from '../errors/TeamIsNotResettableError';
import { generateCustomCrestUrl } from '../storage/userPath';
import Team from '../entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TeamData from '../interfaces/TeamData.interface';
const storage = new TeamStorageAdapter();

@Injectable()
export default class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}
  async addTeam(
    username: string,
    teamData: any,
    imageFileName: string,
  ): Promise<number> {
    if (!teamData || !Object.keys(teamData).length) {
      throw new HttpException(
        'No team data provided',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    try {
      const teamId = storage.findNextFreeTeamId(
        await storage.getTeamsList(username),
      );
      teamData.id = teamId;
      (teamData.crestUrl = generateCustomCrestUrl(teamData.id, imageFileName)),
        await storage.addTeam(username, teamData);
      return teamId;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to add team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async getTeam(teamId: number): Promise<TeamData> {
    try {
      const team: TeamData = await this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['squad'],
      });
      return team;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to get team',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async resetTeam(username: string, teamId: number): Promise<void> {
    try {
      await storage.resetTeam(username, teamId);
    } catch (error) {
      if (error instanceof TeamIsNotResettableError) {
        throw new HttpException(
          'Failed to reset team: team is not resettable',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      console.log(error);
      throw new HttpException(
        'Server failed to reset team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async updateTeam(
    username: string,
    teamId: number,
    newData: { [key: string]: string | number | boolean },
  ): Promise<void> {
    try {
      await storage.updateTeam(newData, username, teamId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to update team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async deleteTeam(username: string, teamId: number): Promise<void> {
    try {
      await storage.deleteTeam(username, teamId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to delete team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
