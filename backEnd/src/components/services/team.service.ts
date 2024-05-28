import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import TeamIsNotResettableError from '@comp/errors/TeamIsNotResettableError';
import { generateCustomCrestUrl } from '@comp/storage/userPath';
import Team from '@comp/entities/team.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import TeamData from '@comp/interfaces/TeamData.interface';
import PlayerService from './player.service';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';
import DefaultTeam from '@comp/entities/defaultTeam.entity';

@Injectable()
export default class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(PlayerService)
    private readonly playerService: PlayerService,
  ) {}
  async addTeam(
    userId: number,
    teamData: TeamData,
    imageFileName: string,
  ): Promise<number> {
    if (!teamData || !Object.keys(teamData).length) {
      throw new HttpException(
        'No team data provided',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    try {
      let newTeam = new Team();
      newTeam = {
        ...newTeam,
        ...teamData,
        user: userId,
        crestUrl: '',
        hasCustomCrest: true,
        crestFileName: imageFileName,
      };
      const teamId = await this.teamRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const team = (await transactionalEntityManager.save(Team, newTeam));
          newTeam.crestUrl = generateCustomCrestUrl(team.id, imageFileName);
          await transactionalEntityManager
            .createQueryBuilder()
            .update(Team)
            .set({crestUrl: newTeam.crestUrl})
            .where('id = :id', { id: team.id })
            .execute();
          return team.id;
        },
      );

      return teamId;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to add team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
  transformTeamDataToDTO(teamData: TeamData): TeamDTO {
    const { id, defaultTeam, ...rest } = teamData;
    const teamDTO: TeamDTO = { ...rest, hasDefault: !!defaultTeam };
    return teamDTO;
  }

  async getTeam(teamId: number): Promise<Team> {
    try {
      const team = await this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['squad', 'defaultTeam'],
      });
      if (!team) throw new Error('Team not found');
      return team;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to get team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  private async getDefaultTeamId(teamId: number): Promise<number> {
    const defaultTeam = (
      await this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['defaultTeam'],
      })
    ).defaultTeam as unknown as DefaultTeam;
    //typescript above strongly believes defaultTeam is just a number
    if (!defaultTeam)
      throw new TeamIsNotResettableError('Team has no default team');
    return defaultTeam.id;
  }

  async resetTeam(teamId: number, userId: number): Promise<void> {
    try {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await this.playerService.clearSquad(teamId);

          const defaultTeamId = await this.getDefaultTeamId(teamId);
          const defaultTeam = await this.getTeam(defaultTeamId);

          let team = new Team();
          team = {
            ...defaultTeam,
            id: teamId,
            user: userId,
            squad: [],
            defaultTeam: defaultTeamId,
          };

          this.playerService.copyPlayersToTeam(team, defaultTeam.squad);

          await transactionalEntityManager.save(Team, team);
        },
      );
    } catch (error) {
      if (error instanceof TeamIsNotResettableError) {
        throw new HttpException(
          'Failed to reset team: team is not resettable',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      console.log(error);
      throw new HttpException(
        'Server failed to reset team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async updateTeam(teamId: number, newData: TeamData): Promise<void> {
    try {
      await this.teamRepository
        .createQueryBuilder()
        .update(Team)
        .set(newData)
        .where('id = :id', { id: teamId })
        .execute();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to update team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async deleteTeam(teamId: number): Promise<void> {
    try {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await this.playerService.clearSquad(teamId);
          await transactionalEntityManager
            .createQueryBuilder()
            .delete()
            .from(Team)
            .where('id = :id', { id: teamId })
            .execute();
        },
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server failed to delete team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
