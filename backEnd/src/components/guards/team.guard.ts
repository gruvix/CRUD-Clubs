import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import handleTeamValidation from './teamValidationHandler';

@Injectable()
export class TeamGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const teamId = request.params.teamId;
    const username = request.session.username;
    await handleTeamValidation(username, teamId);
    return true;
  }
}
