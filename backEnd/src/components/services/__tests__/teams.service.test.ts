import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import * as userPath from '@comp/storage/userPath';
import TeamsService from '../teams.service';
import PlayerService from '../player.service';
import TeamService from '../team.service';
import CrestStorageService from '../crestStorage.service';
import TeamShortDTO from '@comp/interfaces/TeamShortDTO.interface';
import TeamShort from '@comp/models/TeamShort';
import Team from '@comp/entities/team.entity';
import MockEntities from '@comp/testing/MockEntities';

describe('TeamService', () => {
  let teamsService: TeamsService;
  let teamService: TeamService;
  let playerService: PlayerService;
  let crestStorageService: CrestStorageService;

  const mockUtils = new MockTestUtils();
  const mockEntities = new MockEntities();
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

    teamsService = module.get<TeamsService>(TeamsService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });
  describe('getTeamsList', () => {
    it('Should return list of teams', async () => {
      const teamsAmount = 5;
      let databaseTeamShorts = mockUtils.generateTeamArray<TeamShort>(
        teamsAmount,
        'TeamShort',
      );
      let expectedTeamDTOs = databaseTeamShorts.map((team) => {
        return mockUtils.transformTeamShortToDTO(team);
      });

      jest
        .spyOn(mockRepository, 'getMany')
        .mockResolvedValue(databaseTeamShorts);

      const teamsList = await teamsService.getTeamsList(mockUtils.userId);
      expect(teamsList).toEqual(expectedTeamDTOs);
      expect(teamsList.length).toBe(teamsAmount);
      expect(mockRepository.where).toHaveBeenCalledWith('team.user = :userId', {
        userId: mockUtils.userId,
      });
      expect(mockRepository.getMany).toHaveBeenCalled();
    });

    it('Should return an empty list of teams', async () => {
      jest.spyOn(mockRepository, 'getMany').mockResolvedValue([]);
      const teamsList = await teamsService.getTeamsList(mockUtils.userId);
      expect(teamsList).toEqual(expect.arrayContaining<TeamShortDTO>([]));
      expect(teamsList.length).toBe(0);
    });

    it('Should throw an error for missing user id', async () => {
      await expect(teamsService.getTeamsList(NaN)).rejects.toThrow(
        new Error('Missing userId parameter'),
      );
    });

    it('Should re-throw any other errors', async () => {
      jest
        .spyOn(mockRepository, 'getMany')
        .mockRejectedValueOnce(new Error('Something went wrong'));
      await expect(teamsService.getTeamsList(mockUtils.userId)).rejects.toThrow(
        new Error('Something went wrong'),
      );
    });
  });

  describe('copyTeamsToUser', () => {
    const user = mockUtils.userEntity();
    it('Should store the teams in the user object', async () => {
      const amount = 5;
      const teams = mockUtils.generateTeamArray<Team>(amount, 'Team', false);
      const squad = mockUtils.squadGenerator(mockUtils.teamId, amount);
      jest.spyOn(teamService, 'getTeam').mockResolvedValue({ squad } as Team);
      jest
        .spyOn(playerService, 'copyPlayersToTeam')
        .mockImplementationOnce((team, squad) => (team.squad = squad));

      expect(await teamsService.copyTeamsToUser(user, teams)).toBeUndefined();
      expect(user.teams.length).toBe(amount);
      expect(user.teams[0].squad).toEqual(squad);
    });

    it('Should store an empty array of teams on the user object', async () => {
      const teams = [];

      expect(await teamsService.copyTeamsToUser(user, teams)).toBeUndefined();
      expect(user.teams.length).toBe(0);
    });

    it('Should handle errors', async () => {
      const teams = mockUtils.generateTeamArray<Team>(1, 'Team', false);

      jest
        .spyOn(teamService, 'getTeam')
        .mockRejectedValueOnce(new Error('Something went wrong'));

      expect(teamsService.copyTeamsToUser(user, teams)).rejects.toThrow(
        new Error('Something went wrong'),
      );
    });
  });

  describe('resetTeams', () => {
    const teamsAmount = 3;
    it('Should reset all teams from user in database', async () => {
      const defaultTeams = mockUtils.generateTeamArray<Team>(
        teamsAmount,
        'Team',
        true,
      );
      const user = mockEntities.user();
      const teams = mockUtils.generateTeamArray<Team>(
        teamsAmount,
        'Team',
        false,
      );

      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });

      jest.spyOn(mockRepository, 'getMany').mockResolvedValueOnce(teams);
      jest.spyOn(playerService, 'clearSquad').mockResolvedValue(void 0);
      jest
        .spyOn(teamsService, 'getDefaultTeams')
        .mockResolvedValueOnce(defaultTeams);
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(teamsService, 'copyTeamsToUser')
        .mockImplementationOnce(async (user, teams) => {
          user.teams = teams;
        });
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(void 0);
      jest
        .spyOn(crestStorageService, 'clearCrestFolder')
        .mockResolvedValueOnce(void 0);

      expect(await teamsService.resetTeams(mockUtils.userId)).toBeUndefined();
      expect(playerService.clearSquad).toHaveBeenCalledTimes(teamsAmount);
      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...user,
        teams: defaultTeams,
      });
      expect(crestStorageService.clearCrestFolder).toHaveBeenCalledWith(
        mockUtils.userId,
      );
    });

    it('Should reset a user with no teams', async () => {
      const defaultTeams = mockUtils.generateTeamArray<Team>(
        teamsAmount,
        'Team',
        true,
      );
      const user = mockEntities.user();

      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {};
          return await callback(transactionalEntityManager);
        });

      jest.spyOn(mockRepository, 'getMany').mockResolvedValueOnce([] as Team[]);
      jest.spyOn(playerService, 'clearSquad');
      jest
        .spyOn(teamsService, 'getDefaultTeams')
        .mockResolvedValueOnce(defaultTeams);
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(teamsService, 'copyTeamsToUser')
        .mockImplementationOnce(async (user, teams) => {
          user.teams = teams;
        });
      jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(void 0);
      jest
        .spyOn(crestStorageService, 'clearCrestFolder')
        .mockResolvedValueOnce(void 0);

      expect(await teamsService.resetTeams(mockUtils.userId)).toBeUndefined();
      expect(playerService.clearSquad).not.toHaveBeenCalled();
      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...user,
        teams: defaultTeams,
      });
      expect(crestStorageService.clearCrestFolder).toHaveBeenCalledWith(
        mockUtils.userId,
      );
    });

    it('Should throw an error when userId is missing', async () => {
      await expect(teamsService.resetTeams(null)).rejects.toThrow(
        new Error('Missing userId parameter'),
      );
    })

    it('Should handle errors', async () => {
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          throw new Error('Something went wrong');
        });
      await expect(teamsService.resetTeams(mockUtils.userId)).rejects.toThrow(
        new Error('Something went wrong'),
      );
    });
  });
});
