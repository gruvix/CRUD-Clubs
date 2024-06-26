import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import * as userPath from '@comp/storage/userPath';
import PlayerService from '../player.service';
import CrestStorageService from '../crestStorage.service';
import TeamService from '../team.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import Team from '@comp/entities/team.entity';
import TeamData from '@comp/interfaces/TeamData.interface';

describe('TeamService', () => {
  let playerService: PlayerService;
  let teamService: TeamService;
  let crestStorageService: CrestStorageService;
  const mocks = new MockTestUtils();

  const mockGetRepositoryToken = jest
    .fn()
    .mockReturnValue(Symbol('MockedRepositoryToken'));

  jest
    .spyOn(TypeORM, 'getRepositoryToken')
    .mockImplementation(mockGetRepositoryToken);
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      providers: [
        {
          provide: Symbol('MockedRepositoryToken'),
          useValue: mockRepository,
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    teamService = module.get<TeamService>(TeamService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });

  describe('addTeam', () => {
    it('Should add a new team with an empty squad', async () => {
      const teamEntity = mocks.teamEntityWithEmptySquad();
      const teamData = mocks.teamDataWithEmptySquad();
      jest
        .spyOn(userPath, 'generateCustomCrestUrl')
        .mockImplementationOnce(() => mocks.newCrestUrl);
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {
            save: jest.fn(() => teamEntity),
          };
          return await callback(transactionalEntityManager);
        });

      await expect(
        teamService.addTeam(mocks.userId, teamData, mocks.crestFileName),
      ).resolves.toEqual(teamData.id);
      expect(mockRepository.execute).toHaveBeenCalled();
      expect(userPath.generateCustomCrestUrl).toHaveBeenCalledWith(
        mocks.teamId,
        mocks.crestFileName,
      );
      expect(teamEntity.squad.length).toEqual(0);
    });

    it('Should add a new team with a non-empty squad', async () => {
      const teamEntity = mocks.teamEntityWithEmptySquad();
      const playersAmount = 5;
      teamEntity.squad = mocks.squadGenerator(mocks.teamId, playersAmount);
      const teamData = mocks.teamDataWithEmptySquad();
      teamData.squad = mocks.squadGenerator(mocks.teamId, playersAmount);
      jest
        .spyOn(userPath, 'generateCustomCrestUrl')
        .mockImplementationOnce(() => mocks.newCrestUrl);
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {
            save: jest.fn(() => teamEntity),
          };
          return await callback(transactionalEntityManager);
        });

      await expect(
        teamService.addTeam(mocks.userId, teamData, mocks.crestFileName),
      ).resolves.toEqual(teamData.id);
      expect(mockRepository.execute).toHaveBeenCalled();
      expect(userPath.generateCustomCrestUrl).toHaveBeenCalledWith(
        mocks.teamId,
        mocks.crestFileName,
      );
      expect(teamEntity.squad.length).toEqual(playersAmount);
    });

    it('Should throw an error when teamData is undefined', async () => {
      await expect(
        teamService.addTeam(mocks.userId, undefined, mocks.crestFileName),
      ).rejects.toThrow(
        new HttpException(
          'No team data provided',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    it('Should handle other errors', async () => {
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          throw new Error("i'm an error");
        });
      await expect(
        teamService.addTeam(
          mocks.userId,
          mocks.teamDataWithEmptySquad(),
          mocks.crestFileName,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to add team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('transformTeamDataToDTO', () => {
    it('Should return a teamDTO with an empty squad', () => {
      const teamData = { ...mocks.teamDataWithEmptySquad(), defaultTeam: 1 };
      expect(teamService.transformTeamDataToDTO(teamData)).toEqual(
        mocks.TeamDTO(),
      );
    });

    it('Should return a teamDTO with a non-empty squad', () => {
      const playersAmount = 5;
      const teamData = {
        ...mocks.teamDataWithEmptySquad(),
        defaultTeam: 1,
        squad: mocks.squadGenerator(mocks.teamId, playersAmount),
      };
      const expectedTeamDTO = {
        ...mocks.TeamDTO(),
        squad: mocks.squadGenerator(mocks.teamId, playersAmount),
      };
      expect(teamService.transformTeamDataToDTO(teamData)).toEqual(
        expectedTeamDTO,
      );
      expect(expectedTeamDTO.squad.length).toEqual(playersAmount);
    });

    it('Should throw an error when teamData is undefined', () => {
      expect(() => teamService.transformTeamDataToDTO(undefined)).toThrow(
        new Error('No team data provided'),
      );
    });
  });

  describe('getTeam', () => {
    it('Should return a team entity with full properties and relations', async () => {
      const playersAmount = 5;
      const teamEntity = {
        ...mocks.teamEntityWithEmptySquad(),
        squad: mocks.squadGenerator(mocks.teamId, playersAmount),
        user: mocks.userEntity,
      };
      const selections = ['a', 'list', 'of', 'properties'];
      const selectionsObject = {
        a: true,
        list: true,
        of: true,
        properties: true,
      };
      const relations = ['a', 'list', 'of', 'relations'];
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(teamEntity);
      expect(
        await teamService.getTeam(mocks.teamId, relations, selections),
      ).toEqual(teamEntity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mocks.teamId },
        select: { ...selectionsObject, id: true },
        relations: relations,
      });
    });

    it('Should return a team object with only id', async () => {
      const teamEntity = new Team();
      teamEntity.id = mocks.teamId;
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(teamEntity);
      expect(await teamService.getTeam(mocks.teamId, [], [])).toEqual(
        teamEntity,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mocks.teamId },
        select: { id: true },
        relations: [],
      });
    });

    it('Should return a team object with all non-select false properties', async () => {
      const teamEntity = mocks.teamEntityWithEmptySquad();
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(teamEntity);
      expect(await teamService.getTeam(mocks.teamId)).toEqual(teamEntity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mocks.teamId },
        select: {},
        relations: undefined,
      });
    });

    it('Should throw an error when retrieved team is undefined', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(teamService.getTeam(mocks.teamId)).rejects.toEqual(
        new HttpException('Team not found', HttpStatus.NOT_FOUND),
      );
    });

    it('Should handle other errors', async () => {
      jest
        .spyOn(mockRepository, 'findOne')
        .mockRejectedValueOnce(new Error("i'm an error"));
      await expect(teamService.getTeam(mocks.teamId)).rejects.toEqual(
        new HttpException(
          'Failed to get team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('resetTeam', () => {
    let teamWithCrestAndDefaultData: Team;
    let defaultTeam: Team;
    let defaultTeamWithEmptySquadAndDefaultTeamId: Team;
    beforeEach(() => {
      teamWithCrestAndDefaultData = {
        id: mocks.teamId,
        crestFileName: 'name',
        hasCustomCrest: true,
        defaultTeam: { id: mocks.teamId },
      } as unknown as Team;

      defaultTeam = mocks.defaultTeamEntity();
      defaultTeamWithEmptySquadAndDefaultTeamId = {
        ...defaultTeam,
        squad: [],
        defaultTeam: mocks.teamId,
      };
    });
    it('Should reset a team with a custom crest', async () => {
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });

      jest
        .spyOn(teamService, 'getTeam')
        .mockResolvedValueOnce(teamWithCrestAndDefaultData)
        .mockResolvedValueOnce(defaultTeam);
      jest.spyOn(playerService, 'clearSquad').mockResolvedValueOnce(void 0);
      jest
        .spyOn(playerService, 'copyPlayersToTeam')
        .mockImplementationOnce((team, squad) => ({}));
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(void 0);
      jest
        .spyOn(crestStorageService, 'deleteCrest')
        .mockResolvedValueOnce(void 0);

      expect(await teamService.resetTeam(mocks.userId, mocks.teamId)).toEqual(
        void 0,
      );
      expect(playerService.clearSquad).toHaveBeenCalledWith(mocks.teamId);
      expect(playerService.copyPlayersToTeam).toHaveBeenCalledWith(
        defaultTeamWithEmptySquadAndDefaultTeamId,
        defaultTeam.squad,
      );
      expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
        mocks.userId,
        teamWithCrestAndDefaultData.crestFileName,
      );
    });

    it('Should reset a team without a custom crest', async () => {
      teamWithCrestAndDefaultData.hasCustomCrest = false;
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });

      jest
        .spyOn(teamService, 'getTeam')
        .mockResolvedValueOnce(teamWithCrestAndDefaultData)
        .mockResolvedValueOnce(defaultTeam);
      jest.spyOn(playerService, 'clearSquad').mockResolvedValueOnce(void 0);
      jest
        .spyOn(playerService, 'copyPlayersToTeam')
        .mockImplementationOnce((team, squad) => ({}));
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(void 0);
      jest.spyOn(crestStorageService, 'deleteCrest');

      expect(await teamService.resetTeam(mocks.userId, mocks.teamId)).toEqual(
        void 0,
      );
      expect(playerService.clearSquad).toHaveBeenCalledWith(mocks.teamId);
      expect(playerService.copyPlayersToTeam).toHaveBeenCalledWith(
        defaultTeamWithEmptySquadAndDefaultTeamId,
        defaultTeam.squad,
      );
      expect(crestStorageService.deleteCrest).not.toHaveBeenCalled();
    });

    it('Should handle non-resettable team error', async () => {
      teamWithCrestAndDefaultData.defaultTeam = null;
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });
      jest
        .spyOn(teamService, 'getTeam')
        .mockResolvedValueOnce(teamWithCrestAndDefaultData);
      jest.spyOn(playerService, 'clearSquad');

      expect(teamService.resetTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
        new HttpException(
          'Failed to reset team: team is not resettable',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
      expect(playerService.clearSquad).not.toHaveBeenCalled();
    });

    it('Should handle other errors', async () => {
      jest
        .spyOn(teamService, 'getTeam')
        .mockRejectedValueOnce(new Error("i'm an error"));
      await expect(
        teamService.resetTeam(mocks.userId, mocks.teamId),
      ).rejects.toThrow(
        new HttpException(
          'Server failed to reset team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateTeam', () => {
    const newTeamData = { name: 'new name' } as TeamData;
    it('Should update a team', async () => {
      expect(await teamService.updateTeam(mocks.teamId, newTeamData)).toEqual(
        void 0,
      );
      expect(mockRepository.set).toHaveBeenCalledWith(newTeamData);
      expect(mockRepository.where).toHaveBeenCalledWith('id = :id', {
        id: mocks.teamId,
      });
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it('Should handle errors', async () => {
      jest.spyOn(mockRepository, 'execute').mockRejectedValueOnce(new Error());
      expect(teamService.updateTeam(mocks.teamId, newTeamData)).rejects.toEqual(
        new HttpException(
          'Server failed to update team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('deleteTeam', () => {
    it('Should delete a team with a custom crest', async () => {
      const crestDataTeam = {
        id: mocks.teamId,
        crestFileName: 'name',
        hasCustomCrest: true,
      } as Team;

      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });
      jest.spyOn(playerService, 'clearSquad').mockResolvedValueOnce(void 0);
      jest.spyOn(teamService, 'getTeam').mockResolvedValueOnce(crestDataTeam);
      jest
        .spyOn(crestStorageService, 'deleteCrest')
        .mockResolvedValueOnce(void 0);

      expect(await teamService.deleteTeam(mocks.userId, mocks.teamId)).toEqual(
        void 0,
      );
      expect(playerService.clearSquad).toHaveBeenCalledWith(mocks.teamId);
      expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
        mocks.userId,
        crestDataTeam.crestFileName,
      );
      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.where);
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it('Should delete a team without custom crest', async () => {
      const crestDataTeam = {
        id: mocks.teamId,
        crestFileName: null,
        hasCustomCrest: false,
      } as Team;

      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });
      jest.spyOn(playerService, 'clearSquad').mockResolvedValueOnce(void 0);
      jest.spyOn(teamService, 'getTeam').mockResolvedValueOnce(crestDataTeam);
      jest.spyOn(crestStorageService, 'deleteCrest');

      expect(await teamService.deleteTeam(mocks.userId, mocks.teamId)).toEqual(
        void 0,
      );
      expect(playerService.clearSquad).toHaveBeenCalledWith(mocks.teamId);
      expect(crestStorageService.deleteCrest).not.toHaveBeenCalled();
      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.where);
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it('Should handle errors', async () => {
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          throw new Error("i'm an error");
        });

      expect(
        teamService.deleteTeam(mocks.userId, mocks.teamId),
      ).rejects.toEqual(
        new HttpException(
          'Server failed to delete team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
