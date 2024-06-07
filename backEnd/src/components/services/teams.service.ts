import { Inject, Injectable } from '@nestjs/common';
import TeamShort from '@comp/models/TeamShort';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';
import PlayerService from './player.service';
import TeamShortDTO from '@comp/interfaces/TeamShortDTO.interface';
import CrestStorageService from '@comp/services/crestStorage.service';

@Injectable()
export default class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(PlayerService)
    private readonly playerService: PlayerService,
    @Inject(CrestStorageService)
    private readonly crestStorage: CrestStorageService,
  ) {}

  private transformTeamShortToDTO(team: TeamShort): TeamShortDTO {
    const { defaultTeam, ...rest } = team;
    const teamDTO: TeamShortDTO = { ...rest, hasDefault: !!defaultTeam };
    return teamDTO;
  }

  async getTeamsList(userId: number): Promise<TeamShortDTO[]> {
    try {
      if (!userId) {
        {
          throw new Error('Missing userId parameter');
        }
      }
      const teamsProps = TeamShort.properties();

      const queryProps = teamsProps.map((prop) => 'team.' + prop);
      queryProps.push('dt.id AS defaultTeam');
      //this includes the default team id
      const teamsData: TeamShort[] = await this.teamRepository
        .createQueryBuilder('team')
        .select(queryProps)
        .leftJoinAndSelect('team.defaultTeam', 'dt')
        .where('team.user = :userId', { userId })
        .getMany();

      const teamsDTO = teamsData.map((team) =>
        this.transformTeamShortToDTO(team),
      );

      return teamsDTO;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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

  async resetTeams(userId: number) {
    try {
      if (!userId) throw new Error('Missing userId parameter');

      await this.teamRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await this.teamRepository
            .createQueryBuilder('team')
            .select('team.id')
            .where('team.user = :userId', { userId })
            .getMany()
            .then((teams) =>
              teams.forEach(async (team) => {
                this.playerService.clearSquad(team.id);
              }),
            );
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Team)
            .where({ user: userId })
            .execute();

          const defaultTeams = await this.getDefaultTeams();
          const user = await this.userRepository.findOne({
            where: { id: userId },
          });
          await this.copyTeamsToUser(user, defaultTeams);
          this.userRepository.save(user);
        },
      );
      this.crestStorage.clearCrestFolder(userId);
    } catch (error) {
      console.log(error);
      throw error;
    }
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
