import { Inject, Injectable } from '@nestjs/common';
import TeamListTeam from '@comp/models/TeamListTeam';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';
import PlayerService from './player.service';

@Injectable()
export default class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(PlayerService) private readonly playerService: PlayerService,
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
  async copyTeamsToUser(user: User, teams: Team[]): Promise<void> {
    const teamsCopy = teams.map(async (team) => {
      let newTeam = new Team();
      newTeam = {
        ...team,
        id: undefined,
        user: user.id,
        squad: [],
        defaultTeam: team.id,
      };

      const players = await this.playerService.getSquad(team.id);
      this.playerService.copyPlayersToTeam(newTeam, players);

      return newTeam;
    });
    user.teams = await Promise.all(teamsCopy);
  }
  async getDefaultTeams(): Promise<Team[]> {
    const defaultUser = await this.userRepository.findOne({
      where: { username: 'default' },
      relations: ['teams'],
    });
    if (!defaultUser) {
      throw new Error('Default user not found');
    }
    return defaultUser.teams;
  }
}
