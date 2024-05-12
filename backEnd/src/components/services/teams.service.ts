import { Injectable } from '@nestjs/common';
import TeamListTeam from '../models/TeamListTeam';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Team from '../entities/team.entity';
import UserService from './user.service';

@Injectable()
export default class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    readonly userService: UserService,
  ) {}

  async getTeamsList(
    userId: number,
  ): Promise<TeamListTeam[]> {
    if (!userId) {
      {
        console.log('Missing userId parameter');
        throw new Error('Missing userId parameter');
      }
    }
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .where('team.user = :userId', { userId });

    const teams = await queryBuilder.getMany();
    const teamsData = teams.map((team) => new TeamListTeam(team));
    return teamsData;
  }

  async resetTeamsList(username: string) {}
}
