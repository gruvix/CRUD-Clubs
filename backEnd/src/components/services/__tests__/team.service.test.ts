import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import * as userPath from '@comp/storage/userPath';
import PlayerService from '../player.service';
import CrestStorageService from '../crestStorage.service';
import TeamService from '../team.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TeamService', () => {
  let playerService: PlayerService;
  let teamService: TeamService;
  let crestStorageService: CrestStorageService;

  const mocks = new MockTestUtils();
  const mockPaths = new PathTestUtils();

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
    it('should add a new team with an empty squad', async () => {
      const teamEntity = mocks.TeamEntityWithEmptySquad();
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

    it('should add a new team with a non-empty squad', async () => {
      const teamEntity = mocks.TeamEntityWithEmptySquad();
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
    it('should return a teamDTO with an empty squad', () => {
      const teamData = { ...mocks.teamDataWithEmptySquad(), defaultTeam: 1 };
      expect(teamService.transformTeamDataToDTO(teamData)).toEqual(
        mocks.TeamDTO(),
      );
    });

    it('should return a teamDTO with a non-empty squad', () => {
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
});
