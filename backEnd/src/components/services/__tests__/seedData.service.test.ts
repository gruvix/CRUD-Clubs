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
        { provide: TypeORM.getRepositoryToken(User), useValue: mockRepository },
        { provide: TypeORM.getRepositoryToken(Team), useValue: mockRepository },
        { provide: TypeORM.getRepositoryToken(Player), useValue: mockRepository },
        {
          provide: Symbol('MockedRepositoryToken'),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seedDataService = module.get<SeedDataService>(SeedDataService);
  });
  
});
