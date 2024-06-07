import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import TeamService from '@comp/services/team.service';
import NewTeamController from '../newTeam.controller';
import TeamsService from '@comp/services/teams.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';

describe('NewTeamController', () => {
  let newTeamController: NewTeamController;
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;

  const mocks = new MockTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [NewTeamController],
    }).compile();
    teamsService = module.get<TeamsService>(TeamsService);
    userService = module.get<UserService>(UserService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    newTeamController = module.get<NewTeamController>(NewTeamController);
  });
  describe('addTeam', () => {
    it('should add a team to the database', async () => {
      const NEW_TEAM_ID = 5000;
      jest.spyOn(teamService, 'addTeam').mockResolvedValueOnce(NEW_TEAM_ID);
      expect(
        await newTeamController.addTeam(
          mocks.userId,
          mocks.teamBodyMock,
          mocks.crestFileName,
        ),
      ).toBe(NEW_TEAM_ID);
      expect(teamService.addTeam).toHaveBeenCalledWith(
        mocks.userId,
        JSON.parse(mocks.teamBodyMock.teamData),
        'image.jpg',
      );
    });

    it('should handle errors from adding a team', async () => {
      jest
        .spyOn(teamService, 'addTeam')
        .mockRejectedValueOnce(new Error())
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
        );
      await expect(
        newTeamController.addTeam(
          mocks.userId,
          mocks.teamBodyMock,
          mocks.crestFileName,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to add team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      await expect(
        newTeamController.addTeam(
          mocks.userId,
          mocks.teamBodyMock,
          mocks.crestFileName,
        ),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
