import { Test } from '@nestjs/testing';
import TeamService from '@comp/services/team.service';
import CrestService from '@comp/services/crest.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import * as fileSystem from 'fs/promises';
import CrestStorageService from '@comp/services/crestStorage.service';
import * as path from '@comp/storage/userPath';
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';

describe('CrestController', () => {
  let teamService: TeamService;
  let crestService: CrestService;
  let crestStorageService: CrestStorageService;

  const mocks = new MockTestUtils();
  const paths = new PathTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
    }).compile();
    teamService = module.get<TeamService>(TeamService);
    crestService = module.get<CrestService>(CrestService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });
});
