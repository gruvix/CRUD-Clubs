import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import isNonNegativeNumber from './isNonNegativeNumber';
import UserService from '../services/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Team from '../entities/team.entity';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
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
    if (await this.teamExistsOnUser(userId, teamId)) {
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
      const team = await this.teamRepository
        .createQueryBuilder('team')
        .where('team.id = :teamId', { teamId })
        .andWhere('team.user = :userId', { userId })
        .getOne();

      if (team) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error('Failed to validate team: ' + error);
    }
  }
}
