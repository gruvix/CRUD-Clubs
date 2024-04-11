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
      throw new HttpException('Invalid team id', HttpStatus.BAD_REQUEST);
    }
    if (await isTeamValid(username, teamId)) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
