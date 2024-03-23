import { HttpException, HttpStatus } from '@nestjs/common';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';

const storage = new TeamStorageAdapter();
export default function handleTeamValidation(
  username: string,
  teamId: number | string,
): null | Error {
  if (!storage.validateTeam(username, teamId)) {
    throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
  }
  return null;
}
