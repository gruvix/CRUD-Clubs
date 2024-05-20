import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TeamsService from '@comp/services/teams.service';
import TeamsController from '@comp/controllers/teams.controller';
import TeamListTeam from '@comp/models/TeamListTeam';
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import Team from '@comp/entities/team.entity';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;
  let userService: UserService;

  const username = 'test';
  const userId = 1;

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
    const mockRequest = {
      session: { username },
    } as CustomRequest;

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

      jest.spyOn(userService, 'getUserId').mockResolvedValueOnce(userId);

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

      jest.spyOn(userService, 'getUserId').mockResolvedValueOnce(userId);

      expect(await teamsController.getTeamsList(mockRequest)).toEqual({
        teams: mockResult,
        username,
      });
    });

  });
});
