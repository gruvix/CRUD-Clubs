import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import TeamsController from '@comp/controllers/teams.controller';
import TeamsService from '@comp/services/teams.service';
import UserService from '@comp/services/user.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;
  let userService: UserService;

  const username = 'test';
  const userId = 1;

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

      expect(await teamsController.getTeamsList(userId, username)).toEqual({
        teams: mockResult,
        username,
      });
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(userId);
    });

    it('should return an empty array of teams', async () => {
      const mockResult = [];

      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockResolvedValueOnce(mockResult);

      expect(await teamsController.getTeamsList(userId, username)).toEqual({
        teams: mockResult,
        username,
      });
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(userId);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockRejectedValueOnce(new Error());
      await expect(
        teamsController.getTeamsList(userId, username),
      ).rejects.toThrow(
        new HttpException(
          'Failed to get teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(teamsService.getTeamsList).toHaveBeenCalledWith(userId);
    });
  });

  describe('resetTeamsList', () => {
    it('should call the resetTeamsList method from teams service', async () => {
      jest.spyOn(teamsService, 'resetTeams').mockResolvedValueOnce();

      expect(await teamsController.resetTeams(userId)).toBeUndefined();
      expect(teamsService.resetTeams).toHaveBeenCalledWith(userId);
    });

    it('should handle errors', async () => {
      jest.spyOn(teamsService, 'resetTeams').mockRejectedValueOnce(new Error());
      await expect(teamsController.resetTeams(userId)).rejects.toThrow(
        new HttpException(
          'Failed to reset teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(teamsService.resetTeams).toHaveBeenCalledWith(userId);
    });
  });
});
