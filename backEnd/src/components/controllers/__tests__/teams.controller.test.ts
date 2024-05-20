import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import TeamsService from '@comp/services/teams.service';
import TeamsController from '@comp/controllers/teams.controller';
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';
import UserNotFoundError from '@comp/errors/UserNotFoundError';

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;
  let userService: UserService;

  const username = 'test';
  const userId = 1;

  const mockRequest = {
    session: { username, userId },
  } as CustomRequest;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        TeamsService,
        UserService,
        { provide: getRepositoryToken(Team), useValue: jest.fn() },
        { provide: getRepositoryToken(User), useValue: jest.fn() },
      ],
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
          hasCustomCrest: true,
        },
      ];

      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockResolvedValueOnce(mockResult);

      expect(await teamsController.getTeamsList(mockRequest)).toEqual({
        teams: mockResult,
        username,
      });
    });

    it('should return an empty array of teams', async () => {
      const mockResult = [];

      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockResolvedValueOnce(mockResult);

      expect(await teamsController.getTeamsList(mockRequest)).toEqual({
        teams: mockResult,
        username,
      });
    });

    it('should handle other errors', async () => {
      jest
        .spyOn(teamsService, 'getTeamsList')
        .mockRejectedValueOnce(new Error());
      await expect(teamsController.getTeamsList(mockRequest)).rejects.toThrow(
        new HttpException(
          'Failed to get teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('resetTeamsList', () => {
    it('should call the resetTeamsList method from teams service', async () => {
      jest.spyOn(teamsService, 'resetTeamsList').mockResolvedValueOnce();

      expect(await teamsController.resetTeamsList(mockRequest)).toBeUndefined();
      expect(teamsService.resetTeamsList).toHaveBeenCalledWith(userId);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(teamsService, 'resetTeamsList')
        .mockRejectedValueOnce(new Error());
      await expect(teamsController.resetTeamsList(mockRequest)).rejects.toThrow(
        new HttpException(
          'Failed to reset teams',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(teamsService.resetTeamsList).toHaveBeenCalledWith(userId);
    });
  });
});
