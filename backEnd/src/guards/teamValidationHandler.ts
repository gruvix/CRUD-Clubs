import { HttpException, HttpStatus } from '@nestjs/common';
import { validateTeam } from 'src/components/teamStorage';

export default function handleTeamValidation(
  username: string,
  teamId: number | string,
): null | Error {
  if (!validateTeam(username, teamId)) {
    throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
  }
  return null;
}
