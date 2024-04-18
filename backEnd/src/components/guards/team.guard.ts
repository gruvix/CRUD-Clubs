import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import isTeamValid from './isTeamValid';
import isNonNegativeNumber from './isNonNegativeNumber';

@Injectable()
export class TeamGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.params.teamId = Number(request.params.teamId);
    const teamId = request.params.teamId;
    const username = request.session.username;
    if (!isNonNegativeNumber(teamId)) {
      console.log(`User ${username} tried to access team ${teamId}, but the ID is invalid`);
      throw new HttpException('Invalid team id', HttpStatus.BAD_REQUEST);
    }
    if (await isTeamValid(username, teamId)) {
      console.log(`User ${username} tried to access team ${teamId}, but it doesn't exist`);
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
