import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import handleTeamValidation from './teamValidationHandler';

@Injectable()
export class TeamGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const teamId = request.params.teamId;
    const username = request.session.username;
    handleTeamValidation(username, teamId);
    return true;
  }
}
