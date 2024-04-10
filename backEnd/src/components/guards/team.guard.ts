import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import isTeamValid from './isTeamValid';

@Injectable()
export class TeamGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const teamId = request.params.teamId;
    const username = request.session.username;
    if (await isTeamValid(username, teamId)) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
