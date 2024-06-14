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

describe('TeamService', () => {
  let teamsService: TeamsService;
  let teamService: TeamService;
  let playerService: PlayerService;
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

    teamsService = module.get<TeamsService>(TeamsService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });
  describe('getTeamsList', () => {
    it('Should return list of teams', async () => {
      const teamsAmount = 5;
      let databaseTeamShorts = mocks.generateTeamArray<TeamShort>(
        teamsAmount,
        'TeamShort',
      );
      let expectedTeamDTOs = databaseTeamShorts.map((team) => {
        return mocks.transformTeamShortToDTO(team);
      });

      jest
        .spyOn(mockRepository, 'getMany')
        .mockResolvedValue(databaseTeamShorts);

      const teamsList = await teamsService.getTeamsList(mocks.userId);
      expect(teamsList).toEqual(expectedTeamDTOs);
      expect(teamsList.length).toBe(teamsAmount);
      expect(mockRepository.where).toHaveBeenCalledWith('team.user = :userId', {
        userId: mocks.userId,
      });
      expect(mockRepository.getMany).toHaveBeenCalled();
    });

    it('Should return an empty list of teams', async () => {
      jest.spyOn(mockRepository, 'getMany').mockResolvedValue([]);
      const teamsList = await teamsService.getTeamsList(mocks.userId);
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
      await expect(teamsService.getTeamsList(mocks.userId)).rejects.toThrow(
        new Error('Something went wrong'),
      );
    });
  });

  describe('copyTeamsToUser', () => {
    const user = mocks.userEntity();
    it('Should store the teams in the user object', async () => {
      const amount = 5;
      const teams = mocks.generateTeamArray<Team>(amount, 'Team', false);
      const squad = mocks.squadGenerator(mocks.teamId, amount);
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
      const teams = mocks.generateTeamArray<Team>(1, 'Team', false);

      jest
        .spyOn(teamService, 'getTeam')
        .mockRejectedValueOnce(new Error('Something went wrong'));

      expect(teamsService.copyTeamsToUser(user, teams)).rejects.toThrow(
        new Error('Something went wrong'),
      );
    });
  });
});
