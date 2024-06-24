import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Player from '@comp/entities/player.entity';
import isNonNegativeNumber from '@comp/validators/isNonNegativeNumber';

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.params.teamId = Number(request.params.teamId);
    const teamId = request.params.teamId;
    const playerId = request.body.id;
    const userId = request.session.userId;

      if (!isNonNegativeNumber(playerId)) {
        console.log(
          `User ${userId} tried to access team ${teamId}, but the ID is invalid`,
        );
        throw new HttpException('Invalid player id', HttpStatus.BAD_REQUEST);
      }

      if (!await this.playerExistsOnTeam(teamId, playerId)) {
        console.log(
          `User ${userId} tried to access team ${teamId}, but there is no player related to teamId: ${teamId}`,
        );
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return true;
    }

  private async playerExistsOnTeam(teamId: number, playerId: number): Promise<boolean> {
    try{
        const player = await this.playerRepository
        .createQueryBuilder('player')
        .where('player.id = :playerId', { playerId })
        .andWhere('player.team = :teamId', { teamId })
        .getOne();
        if(!player) return false;
        return true;
    } catch(error) {
        throw new Error('Failed to validate player: ' + error);
    }
  }
}
