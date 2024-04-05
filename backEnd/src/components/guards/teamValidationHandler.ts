import { HttpException, HttpStatus } from '@nestjs/common';
import TeamStorageAdapter from '../Adapters/teamStorage.adapter';

const storage = new TeamStorageAdapter();
export default async function handleTeamValidation(
  username: string,
  teamId: number | string,
): Promise<null | Error> {
  if (!(await storage.validateTeam(username, teamId))) {
    throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
  }
  return null;
}
