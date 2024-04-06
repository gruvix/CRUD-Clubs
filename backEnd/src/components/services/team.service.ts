import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import TeamStorageAdapter from 'src/components/Adapters/teamStorage.adapter';
import teamIsNotResettableError from '../errors/teamIsNotResettableError';
const storage = new TeamStorageAdapter();

@Injectable()
export default class TeamService {
  async addTeam(
    username: string,
    teamData: any,
    imageFileName: string,
  ): Promise<number> {
    try {
      const id = await storage.addTeam(username, teamData, imageFileName);
      return id;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to add team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async resetTeam(username: string, teamId: string | number): Promise<void> {
    try {
      await storage.resetTeam(username, teamId);
    } catch (error) {
      if (error instanceof teamIsNotResettableError) {
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

  async getTeamData(
    username: string,
    teamId: string | number,
  ): Promise<TeamExtended> {
    try {
      return await storage.getTeam(username, teamId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to get team',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  async updateTeamData(
    username: string,
    teamId: string | number,
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

  async deleteTeam(username: string, teamId: string | number): Promise<void> {
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
