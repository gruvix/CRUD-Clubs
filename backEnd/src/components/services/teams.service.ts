import { Injectable } from '@nestjs/common';
import TeamListTeam from '@comp/models/TeamListTeam';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Team from '@comp/entities/team.entity';

@Injectable()
export default class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async getTeamsList(userId: number): Promise<TeamListTeam[]> {
    try {
      if (!userId) {
        {
          throw new Error('Missing userId parameter');
        }
      }
      const teamsProps = TeamListTeam.properties();

      const teamsData: TeamListTeam[] = await this.teamRepository
        .createQueryBuilder('team')
        .select(teamsProps.map((prop) => 'team.' + prop))
        .where('team.user = :userId', { userId })
        .getMany();

      return teamsData;
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetTeamsList(username: string) {}
}
