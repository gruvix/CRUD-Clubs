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

  async getTeamsList(userId: number): Promise<TeamListTeam[]> {
    try {
      if (!userId) {
        {
          throw new Error('Missing userId parameter');
        }
      }
      const queryBuilder = this.teamRepository
        .createQueryBuilder('team')
        .where('team.user = :userId', { userId });
      const teamsProps = TeamListTeam.properties();
      const teamsData: TeamListTeam[] = (await queryBuilder
        .select(teamsProps.map((prop) => 'team.' + prop))
        .getMany()) as TeamListTeam[];
      return teamsData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetTeamsList(username: string) {}
}
