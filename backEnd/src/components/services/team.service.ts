import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import TeamStorageAdapter from '@comp/Adapters/teamStorage.adapter';
import TeamIsNotResettableError from '@comp/errors/TeamIsNotResettableError';
import { generateCustomCrestUrl } from '@comp/storage/userPath';
import Team from '@comp/entities/team.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import TeamData from '@comp/interfaces/TeamData.interface';
import PlayerService from './player.service';
import TeamDTO from '@comp/interfaces/teamDTO.interface';
const storage = new TeamStorageAdapter();

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
    username: string,
    teamData: any,
    imageFileName: string,
  ): Promise<number> {
    if (!teamData || !Object.keys(teamData).length) {
      throw new HttpException(
        'No team data provided',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    try {
      const teamId = storage.findNextFreeTeamId(
        await storage.getTeamsList(username),
      );
      teamData.id = teamId;
      (teamData.crestUrl = generateCustomCrestUrl(teamData.id, imageFileName)),
        await storage.addTeam(username, teamData);
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
  private transformTeamDataToDTO(teamData: TeamData): TeamDTO {
    const { id, defaultTeam, ...rest } = teamData;
    const teamDTO: TeamDTO = { ...rest, hasDefault: !!defaultTeam };
    return teamDTO
  }

  async getTeam(teamId: number): Promise<TeamDTO> {
    try {
      const team: TeamData = await this.teamRepository.findOne({
        where: { id: teamId },
        relations: ['squad', 'defaultTeam'],
      });
      if (!team) throw new Error('Team not found');
      return this.transformTeamDataToDTO(team);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to get team',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async resetTeam(teamId: number): Promise<void> {
    try {
      // implement ORM query to reset team
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
