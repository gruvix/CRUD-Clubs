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

});
