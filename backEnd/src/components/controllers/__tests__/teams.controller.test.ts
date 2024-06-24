import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import TeamsController from '@comp/controllers/teams.controller';
import TeamsService from '@comp/services/teams.service';
import UserService from '@comp/services/user.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;
  let userService: UserService;

  const mocks = new MockTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [TeamsController],
    }).compile();

    teamsService = module.get<TeamsService>(TeamsService);
    userService = module.get<UserService>(UserService);
    teamsController = module.get<TeamsController>(TeamsController);
  });

  describe('getTeamsList', () => {
    it('should return an array of teams', async () => {
      const mockResult = [
        {
          id: 1,
          name: 'test',
          crestUrl: 'test',
          hasDefault: true,
          hasCustomCrest: true,
        },
      ];

      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockResolvedValueOnce(mockResult);

      expect(
        await teamsController.getTeamsList(mocks.userId, mocks.username),
      ).toEqual({
        teams: mockResult,
        username: mocks.username,
      });
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(mocks.userId);
    });

    it('should return an empty array of teams', async () => {
      const mockResult = [];

      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockResolvedValueOnce(mockResult);

      expect(
        await teamsController.getTeamsList(mocks.userId, mocks.username),
      ).toEqual({
        teams: mockResult,
        username: mocks.username,
      });
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(mocks.userId);
    });

    it('Should re-throw http exceptions', async () => {
      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
        );
      await expect(
        teamsController.getTeamsList(mocks.userId, mocks.username),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
      );
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(mocks.userId);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockRejectedValueOnce(new Error());
      await expect(
        teamsController.getTeamsList(mocks.userId, mocks.username),
      ).rejects.toThrow(
        new HttpException(
          'Failed to get teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(mocks.userId);
    });
  });

  describe('resetTeamsList', () => {
    it('should call the resetTeamsList method from teams service', async () => {
      jest.spyOn(teamsService, 'resetTeams').mockResolvedValueOnce();

      expect(await teamsController.resetTeams(mocks.userId)).toBeUndefined();
      expect(teamsService.resetTeams).toHaveBeenCalledWith(mocks.userId);
    });

    it('Should re-throw http exceptions', async () => {
      jest
        .spyOn(teamsService, 'resetTeams')
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
        );
      await expect(teamsController.resetTeams(mocks.userId)).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
      );
    });

    it('should handle errors', async () => {
      jest.spyOn(teamsService, 'resetTeams').mockRejectedValueOnce(new Error());
      await expect(teamsController.resetTeams(mocks.userId)).rejects.toThrow(
        new HttpException(
          'Failed to reset teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(teamsService.resetTeams).toHaveBeenCalledWith(mocks.userId);
    });
  });
});
