import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import TeamService from '@comp/services/team.service';
import TeamsService from '@comp/services/teams.service';
import CrestService from '@comp/services/crest.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import UserController from '../user.controller';
import CustomRequest from '@comp/interfaces/CustomRequest.interface';
import UserNotFoundError from '@comp/errors/UserNotFoundError';
import MockTestUtils from '@comp/testing/MockTestUtils';
import InvalidUsernameError from '@comp/errors/InvalidUsernameError';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;
  let crestService: CrestService;

  const mocks = new MockTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [UserController],
    }).compile();
    teamsService = module.get<TeamsService>(TeamsService);
    userService = module.get<UserService>(UserService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    crestService = module.get<CrestService>(CrestService);
    userController = module.get<UserController>(UserController);
  });
  describe('getUserStatus', () => {
    it('should return user status', async () => {
      await expect(userController.getUserStatus(mocks.userId)).resolves.toEqual(
        undefined,
      );
    });
  });
  describe('login', () => {
    it('should login the user on success', async () => {
      jest.spyOn(userService, 'findOrCreateUser').mockResolvedValueOnce(void 0);
      jest.spyOn(userService, 'getUserId').mockResolvedValueOnce(mocks.userId);

      const mockData = { username: 'test' };
      const mockRequest = { session: {} } as CustomRequest;

      await expect(
        userController.login(mockRequest as any, mockData),
      ).resolves.toEqual(undefined);
      expect(userService.findOrCreateUser).toHaveBeenCalledWith(
        mockData.username,
      );
      expect(userService.getUserId).toHaveBeenCalledWith(mockData.username);
      expect(mockRequest.session.userId).toBe(mocks.userId);
      expect(mockRequest.session.username).toBe(mockData.username);
    });

    it('should throw an error for failed login (invalid username)', async () => {
      jest
        .spyOn(userService, 'findOrCreateUser')
        .mockRejectedValueOnce(new InvalidUsernameError());

      const mockData = { username: '12345' };
      const mockRequest = { session: {} } as CustomRequest;

      await expect(
        userController.login(mockRequest as any, mockData),
      ).rejects.toEqual(
        new HttpException('Invalid username', HttpStatus.BAD_REQUEST),
      );
      expect(userService.findOrCreateUser).toHaveBeenCalledWith(
        mockData.username,
      );
    });

    it('should throw an error for failed login (user not found)', async () => {
      jest.spyOn(userService, 'findOrCreateUser').mockResolvedValueOnce(void(0));
      jest
        .spyOn(userService, 'getUserId')
        .mockRejectedValueOnce(new UserNotFoundError('User not found'));

      const mockData = { username: 'test' };
      const mockRequest = { session: {} } as CustomRequest;

      await expect(
        userController.login(mockRequest as any, mockData),
      ).rejects.toEqual(
        new HttpException('User not found', HttpStatus.BAD_REQUEST),
      );
      expect(userService.findOrCreateUser).toHaveBeenCalledWith(
        mockData.username,
      );
    });

    it('should throw an error on login failure', async () => {
      jest
        .spyOn(userService, 'findOrCreateUser')
        .mockRejectedValueOnce(new Error('im an error'));
      const mockData = { username: 'test' };
      const mockRequest = { session: {} } as CustomRequest;

      await expect(userController.login(mockRequest as any, mockData)).rejects.toThrow(
        new HttpException('Failed to login user', HttpStatus.INTERNAL_SERVER_ERROR),
      )
    })
  });

  describe('logout', () => {
    it('should destroy the session on logout success', async () => {
      const mockRequest = {
        session: {
          userId: mocks.userId,
          username: mocks.username,
          destroy: jest
            .fn()
            .mockImplementation(() => (mockRequest.session = undefined)),
        },
      } as any as CustomRequest;

      await expect(userController.logout(mockRequest)).resolves.toEqual(
        undefined,
      );
      expect(mockRequest.session).toBeUndefined();
    });

    it('should throw an error on logout failure', async () => {
      const mockRequest = {
        session: {
          userId: mocks.userId,
          username: mocks.username,
          destroy: jest
            .fn()
            .mockImplementation((callback) =>
              callback(new Error('im an error')),
            ),
        },
      } as any as CustomRequest;

      await expect(userController.logout(mockRequest)).rejects.toEqual(
        new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockRequest.session.destroy).toHaveBeenCalled();
    });
  });
});
