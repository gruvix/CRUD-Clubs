import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import TeamExtended from 'src/components/models/TeamExtended';
import TeamStorageAdapter from 'src/components/Adapters/teamStorage.adapter';
const storage = new TeamStorageAdapter();

@Injectable()
export default class TeamService {
  addTeam(username: string, teamData: any, imageFileName: string) {
    try {
      const id = storage.addTeam(username, teamData, imageFileName);
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

  resetTeam(username: string, teamId: string | number) {
    try {
      const reset = storage.resetTeam(username, teamId);
      if(!reset){
        throw new HttpException(
          'Failed to reset team: team is not resettable',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to reset team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  getTeamData(username: string, teamId: string | number): TeamExtended {
    try {
      return storage.getTeam(username, teamId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to get team',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  updateTeamData(
    username: string,
    teamId: string | number,
    newData: { [key: string]: string | number | boolean },
  ) {
    try {
      storage.updateTeam(newData, username, teamId);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to update team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  deleteTeam(username: string, teamId: string | number) {
    try {
      storage.deleteTeam(username, teamId);
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
