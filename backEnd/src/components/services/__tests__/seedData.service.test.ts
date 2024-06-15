import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import MockEntities from '@comp/testing/MockEntities';
import SeedDataService from '../seedData.service';
import User from '@comp/entities/user.entity';
import Team from '@comp/entities/team.entity';
import Player from '@comp/entities/player.entity';
import {
  mockDataSource,
  queryRunner,
} from '@comp/testing/mockTypeORMDataSource';
import * as dataStorage from '@comp/storage/dataStorage';
import DefaultTeam from '@comp/entities/defaultTeam.entity';

describe('SeedDataService', () => {
  let seedDataService: SeedDataService;

  const mockUtils = new MockTestUtils();
  const mockEntities = new MockEntities();

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
        SeedDataService,
        { provide: TypeORM.getDataSourceToken(), useValue: mockDataSource },
        { provide: TypeORM.getRepositoryToken(User), useValue: mockRepository },
        { provide: TypeORM.getRepositoryToken(Team), useValue: mockRepository },
        {
          provide: TypeORM.getRepositoryToken(Player),
          useValue: mockRepository,
        },
        {
          provide: Symbol('MockedRepositoryToken'),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seedDataService = module.get<SeedDataService>(SeedDataService);
  });

  describe('onModuleInit', () => {
    it('Should seed base teams from JSON into database when default user does not exist', async () => {
      const squadLength = 2;
      const teamsAmount = 5;
      let defaultTeams: DefaultTeam[] = [];
      let createdTeams: Team[] = [];

      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(dataStorage, 'readJSONFile')
        .mockResolvedValueOnce(mockEntities.teamsJSON(teamsAmount))
        .mockImplementation(async (filePath) => {
          const match = filePath.match(/\/teams\/(\d+)\.json/);
          if (!match) {
            throw new Error(`Invalid team file path format: ${filePath}`);
          }
          const teamId = parseInt(match[1], 10);
          const teamJSON = mockEntities.teamJSON(teamId);
          teamJSON.squad = mockEntities.squadJSONGenerator(squadLength);

          createdTeams.push(mockUtils.createTeamFromJSON(teamJSON));

          return teamJSON;
        });

      jest
        .spyOn(queryRunner.manager, 'save')
        .mockResolvedValueOnce(void 0)
        .mockResolvedValueOnce(void 0);

      expect(await seedDataService.onModuleInit()).toBeUndefined();
      const expectedUser = new User();
      expectedUser.username = 'default';
      expectedUser.password = 'default';
      expectedUser.teams = createdTeams;
      createdTeams.forEach((team) => {
        defaultTeams.push(mockUtils.createDefaultTeam(team));
      });
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(2);
      //One for base user, one for default teams
      expect(queryRunner.manager.save).toHaveBeenCalledWith(expectedUser);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(defaultTeams);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('Should not seed base teams from JSON into database when default user already exists', async () => {
      const defaultUser = mockEntities.user();

      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockResolvedValueOnce(defaultUser);
      jest.spyOn(queryRunner.manager, 'save');

      expect(await seedDataService.onModuleInit()).toBeUndefined();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        username: 'default',
      });
      expect(queryRunner.manager.save).not.toHaveBeenCalled();
    });

    it('Should rollback transaction when save fails', async () => {
      const squadLength = 2;
      const teamsAmount = 2;
      let defaultTeams: DefaultTeam[] = [];
      let createdTeams: Team[] = [];

      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(dataStorage, 'readJSONFile')
        .mockResolvedValueOnce(mockEntities.teamsJSON(teamsAmount))
        .mockImplementation(async (filePath) => {
          const match = filePath.match(/\/teams\/(\d+)\.json/);
          if (!match) {
            throw new Error(`Invalid team file path format: ${filePath}`);
          }
          const teamId = parseInt(match[1], 10);
          const teamJSON = mockEntities.teamJSON(teamId);
          teamJSON.squad = mockEntities.squadJSONGenerator(squadLength);

          createdTeams.push(mockUtils.createTeamFromJSON(teamJSON));

          return teamJSON;
        });
      const expectedUser = new User();
      expectedUser.username = 'default';
      expectedUser.password = 'default';
      expectedUser.teams = createdTeams;

      createdTeams.forEach((team) => {
        defaultTeams.push(mockUtils.createDefaultTeam(team));
      });

      jest
        .spyOn(queryRunner.manager, 'save')
        .mockRejectedValueOnce(new Error('Something went wrong'));

      await expect(seedDataService.onModuleInit()).rejects.toThrow(
        new Error('Something went wrong'),
      );
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
      //Should not be called a second time since first should fail
      expect(queryRunner.manager.save).toHaveBeenCalledWith(expectedUser);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('Should throw an error when JSON teams amount is 0', async () => {
      const squadLength = 2;
      const teamsAmount = 5;
      let defaultTeams: DefaultTeam[] = [];
      let createdTeams: Team[] = [];

      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(dataStorage, 'readJSONFile')
        .mockResolvedValueOnce(mockEntities.teamsJSON(null));

      await expect(seedDataService.onModuleInit()).rejects.toThrow(
        new Error('Default user has no teams'),
      );
      expect(queryRunner.manager.save).not.toHaveBeenCalled();
    });
  });
});
