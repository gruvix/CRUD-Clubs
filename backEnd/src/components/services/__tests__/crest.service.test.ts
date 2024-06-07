import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import TeamService from '@comp/services/team.service';
import TeamsService from '@comp/services/teams.service';
import CrestService from '@comp/services/crest.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';

describe('CrestController', () => {
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;
  let crestService: CrestService;
  let crestStorageService: CrestStorageService;
  const userId = 1;
  const teamId = 1;
  const imageFileName = 'image.jpg';

  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
    }).compile();
    teamsService = module.get<TeamsService>(TeamsService);
    userService = module.get<UserService>(UserService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    crestService = module.get<CrestService>(CrestService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });
});
