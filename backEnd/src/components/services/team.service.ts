import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import TeamIsNotResettableError from '@comp/errors/TeamIsNotResettableError';
import { generateCustomCrestUrl } from '@comp/storage/userPath';
import Team from '@comp/entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import TeamData from '@comp/interfaces/TeamData.interface';
import PlayerService from './player.service';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';
import DefaultTeam from '@comp/entities/defaultTeam.entity';
import CrestStorageService from '@comp/services/crestStorage.service';

@Injectable()
export default class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @Inject(PlayerService)
    private readonly playerService: PlayerService,
    @Inject(CrestStorageService)
    private readonly crestStorageService: CrestStorageService,
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
        id: undefined,
        user: userId,
        crestUrl: '',
        hasCustomCrest: true,
        crestFileName: imageFileName,
      };
      const teamId = await this.teamRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const team = await transactionalEntityManager.save(Team, newTeam);
          newTeam.crestUrl = generateCustomCrestUrl(team.id, imageFileName);
          await this.teamRepository
            .createQueryBuilder()
            .update(Team)
            .set({ crestUrl: newTeam.crestUrl })
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
      );
    }
  }
  transformTeamDataToDTO(teamData: TeamData): TeamDTO {
    if (!teamData) throw new Error('No team data provided');
    const { id, defaultTeam, ...rest } = teamData;
    const teamDTO: TeamDTO = { ...rest, hasDefault: !!defaultTeam };
    return teamDTO;
  }
  private generateSelectionsFromStringArray(
    selections: string[],
  ): FindOptionsSelect<Team> {
    const selectOptions: FindOptionsSelect<Team> = {};
    if (selections) {
      selections.forEach((selection) => {
        selectOptions[selection] = true;
      });
    }
    return selectOptions;
  }

  async getTeam(
    teamId: number,
    relations?: string[],
    selections?: string[],
  ): Promise<Team> {
    let team: Team = null;
    try {
      if (selections && !selections.some((item) => item === 'id'))
        selections.push('id');
      //repository fails if id primary key isn't selected
      const selectObject = this.generateSelectionsFromStringArray(selections);

      team = await this.teamRepository.findOne({
        where: { id: teamId },
        select: selectObject,
        relations: relations,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to get team',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!team) throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    return team;
  }

  async resetTeam(userId: number, teamId: number): Promise<void> {
    try {
      const teamRelations = ['defaultTeam'];
      const teamSelections = ['crestFileName', 'hasCustomCrest', 'defaultTeam'];
      const oldTeam = await this.getTeam(teamId, teamRelations, teamSelections);
      if (!oldTeam.defaultTeam)
      throw new TeamIsNotResettableError('Team has no default team');
      const defaultTeamId = (oldTeam.defaultTeam as unknown as DefaultTeam).id;
      //typescript above strongly believes defaultTeam is just a number

      await this.teamRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await this.playerService.clearSquad(teamId);

          const defaultTeam = await this.getTeam(defaultTeamId, ['squad']);

          let team = new Team();
          team = {
            ...defaultTeam,
            id: teamId,
            user: userId,
            squad: [],
            defaultTeam: defaultTeamId,
          };

          this.playerService.copyPlayersToTeam(team, defaultTeam.squad);
          await this.teamRepository.save(team);
          if (oldTeam.hasCustomCrest)
            await this.crestStorageService.deleteCrest(
              userId,
              oldTeam.crestFileName,
            );
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

  async deleteTeam(userId: number, teamId: number): Promise<void> {
    try {
      await this.teamRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await this.playerService.clearSquad(teamId);
          const imageData = await this.getTeam(
            teamId,
            [],
            ['crestFileName', 'hasCustomCrest'],
          );
          await this.teamRepository
            .createQueryBuilder()
            .delete()
            .from(Team)
            .where('id = :id', { id: teamId })
            .execute();
          if (imageData.hasCustomCrest)
            await this.crestStorageService.deleteCrest(
              userId,
              imageData.crestFileName,
            );
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
