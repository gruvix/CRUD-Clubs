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
import Team from '../entities/team.entity';
import { Repository } from 'typeorm';

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
    const userId = await this.userService.getUserId(username);
    if (!isNonNegativeNumber(teamId)) {
      console.log(
        `User ${username} tried to access team ${teamId}, but the ID is invalid`,
      );
      throw new HttpException('Invalid team id', HttpStatus.BAD_REQUEST);
    }
    if (await this.isTeamValid(userId, teamId)) {
      console.log(
        `User ${username} tried to access team ${teamId}, but it doesn't exist`,
      );
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  private async isTeamValid(userId: number, teamId: number): Promise<boolean> {
    if (await this.teamRepository.findOneBy({ id: teamId, user: userId })) {
      return false;
    }
    return true;
  }
}
