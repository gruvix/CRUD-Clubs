import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import isNonNegativeNumber from '@comp/validators/isNonNegativeNumber';
import UserService from '@comp/services/user.service';
import TeamService from '@comp/services/team.service';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
private readonly teamService: TeamService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.params.teamId = Number(request.params.teamId);
    const teamId = request.params.teamId;
    const username = request.session.username;

    if (!isNonNegativeNumber(teamId)) {
      console.log(
        `User ${username} tried to access team ${teamId}, but the ID is invalid`,
      );
      throw new HttpException('Invalid team id', HttpStatus.BAD_REQUEST);
    }

    const userId = await this.userService.getUserId(username);
    if (!await this.teamExistsOnUser(userId, teamId)) {
      console.log(
        `User ${username} tried to access team ${teamId}, but there is no team related to userId ${userId}`,
      );
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  private async teamExistsOnUser(
    userId: number,
    teamId: number,
  ): Promise<boolean> {
    try {
      const team = await this.teamService.getTeam(teamId, [], []);
      if (!team) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error('Failed to validate team: ' + error);
    }
  }
}
