import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import * as dataStorage from '@comp/storage/dataStorage';
import * as path from '@comp/storage/userPath';
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';
import UserService from '../user.service';
import UserNotFoundError from '@comp/errors/UserNotFoundError';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import * as userValidation from '@comp/validators/userValidation';
import InvalidUsernameError from '@comp/errors/InvalidUsernameError';
import TeamsService from '../teams.service';
import Team from '@comp/entities/team.entity';

describe('UserService', () => {
  let userService: UserService;
  let teamsService: TeamsService;

  const mockGetRepositoryToken = jest
    .fn()
    .mockReturnValue(Symbol('MockedRepositoryToken'));

  jest
    .spyOn(TypeORM, 'getRepositoryToken')
    .mockImplementation(mockGetRepositoryToken);

  const mocks = new MockTestUtils();
  const mockPaths = new PathTestUtils();

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

    userService = module.get<UserService>(UserService);
    teamsService = module.get<TeamsService>(TeamsService);
  });

  describe('getUserId', () => {
    it('should return user id', async () => {
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockResolvedValueOnce(mocks.userEntity);

      await expect(userService.getUserId(mocks.username)).resolves.toEqual(
        mocks.userId,
      );
    });

    it('should throw an error for user not found', async () => {
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(userService.getUserId(mocks.username)).rejects.toThrow(
        new UserNotFoundError(`User ${mocks.username} not found`),
      );
    });

    it('should handle other errors', async () => {
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockRejectedValueOnce(new Error('Something went wrong'));
      await expect(userService.getUserId(mocks.username)).rejects.toThrow(
        new Error('Something went wrong'),
      );
    });
  });

  describe('findOrCreateUser', () => {
    it('should find an existing user', async () => {
      jest.spyOn(userValidation, 'isUsernameValid').mockReturnValue(true);
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockResolvedValueOnce(mocks.userEntity);
      jest.spyOn(dataStorage, 'createFolder');

      await expect(
        userService.findOrCreateUser(mocks.username),
      ).resolves.toEqual(void 0);

      expect(userValidation.isUsernameValid).toHaveBeenCalledWith(
        mocks.username,
      );

      expect(dataStorage.createFolder).not.toHaveBeenCalled();
    });

    it('should create a new user and a folder', async () => {
      jest.spyOn(userValidation, 'isUsernameValid').mockReturnValue(true);
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementationOnce(async (callback) => {
          const transactionalEntityManager = {
            save: jest.fn(() => mocks.userEntity),
          };
          return await callback(transactionalEntityManager);
        });

      jest
        .spyOn(teamsService, 'getDefaultTeams')
        .mockResolvedValueOnce([] as Team[]);
      jest.spyOn(teamsService, 'copyTeamsToUser').mockResolvedValueOnce(void 0);

      jest
        .spyOn(path, 'getUserRootPath')
        .mockImplementationOnce((userId) => mocks.userRootPathFromId(userId));
      jest.spyOn(dataStorage, 'createFolder').mockResolvedValueOnce(void 0);

      await expect(
        userService.findOrCreateUser(mocks.username),
      ).resolves.toEqual(void 0);
      expect(userValidation.isUsernameValid).toHaveBeenCalledWith(
        mocks.username,
      );
      expect(mockRepository.manager.transaction).toHaveBeenCalled();
      expect(dataStorage.createFolder).toHaveBeenCalledWith(
        mocks.userRootPathFromId(mocks.userId),
      );
      expect(teamsService.getDefaultTeams).toHaveBeenCalled();
      expect(teamsService.copyTeamsToUser).toHaveBeenCalledWith(
        mocks.userEntity,
        [] as Team[],
      );
    });

    it('should handle invalid username', async () => {
      jest.spyOn(userValidation, 'isUsernameValid').mockReturnValue(false);

      await expect(
        userService.findOrCreateUser(mocks.username),
      ).rejects.toThrow(new InvalidUsernameError());
    });

    it('should handle other errors', async () => {
      jest.spyOn(userValidation, 'isUsernameValid').mockReturnValue(true);
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockRejectedValueOnce(new Error('Something went wrong'));

      await expect(
        userService.findOrCreateUser(mocks.username),
      ).rejects.toThrow(new Error('Something went wrong'));
    });
  });
});
