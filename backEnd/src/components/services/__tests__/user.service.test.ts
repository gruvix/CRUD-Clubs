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

describe('UserService', () => {
  let userService: UserService;

  const mockGetRepositoryToken = jest
    .fn()
    .mockReturnValue(Symbol('MockedRepositoryToken'));

  jest
    .spyOn(TypeORM, 'getRepositoryToken')
    .mockImplementation(mockGetRepositoryToken);

  const mocks = new MockTestUtils();
  const paths = new PathTestUtils();
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      providers: [
        UserService,
        {
          provide: Symbol('MockedRepositoryToken'),
          useValue: mockRepository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  describe('getUserId', () => {
    it('should return user id', async () => {
      jest
        .spyOn(mockRepository, 'findOneBy')
        .mockResolvedValueOnce(mocks.userEntityMock);

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
});
