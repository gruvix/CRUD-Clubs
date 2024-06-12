import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import PlayerService from '../player.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PlayerService', () => {
  let playerService: PlayerService;
  const mocks = new MockTestUtils();
  const mockPaths = new PathTestUtils();

  const mockGetRepositoryToken = jest
    .fn()
    .mockReturnValue(Symbol('MockedRepositoryToken'));

  jest
    .spyOn(TypeORM, 'getRepositoryToken')
    .mockImplementation(mockGetRepositoryToken);
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

    playerService = module.get<PlayerService>(PlayerService);
  });

  describe('addPlayer', () => {
    it('should add player', async () => {
      mockRepository.execute.mockResolvedValueOnce({ raw: mocks.playerId });
      expect(
        await playerService.addPlayer(mocks.teamId, mocks.playerDataWithoutId),
      ).toEqual(mocks.playerId);
      const playerDataWithTeamId = {
        ...mocks.playerDataWithoutId,
        team: mocks.teamId,
      };
      expect(mockRepository.values).toHaveBeenCalledWith(playerDataWithTeamId);
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it('should remove id property from new player data', async () => {
      mockRepository.execute.mockResolvedValueOnce({ raw: mocks.playerId });
      expect(
        await playerService.addPlayer(mocks.teamId, mocks.playerData),
      ).toEqual(mocks.playerId);
      const expectedPlayerData = {
        ...mocks.playerDataWithoutId,
        team: mocks.teamId,
      };
      delete expectedPlayerData.id;
      expect(mockRepository.values).toHaveBeenCalledWith(expectedPlayerData);
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockRepository.execute.mockRejectedValueOnce(new Error());
      await expect(
        playerService.addPlayer(mocks.teamId, mocks.playerDataWithoutId),
      ).rejects.toThrow(
        new HttpException(
          'Server failed to add player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updatePlayer', () => {
    it('should update a player', async () => {
      expect(
        await playerService.updatePlayer(mocks.playerData),
      ).toBeUndefined();
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockRepository.execute.mockRejectedValueOnce(new Error());
      await expect(
        playerService.updatePlayer(mocks.playerData),
      ).rejects.toThrow(
        new HttpException(
          'Server failed to update player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw error when player id is missing', async () => {
      await expect(
        playerService.updatePlayer(mocks.playerDataWithoutId),
      ).rejects.toThrow(
        new HttpException('Missing player id', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('removePlayer', () => {
    it('should delete a player', async () => {
      expect(await playerService.removePlayer(mocks.playerId)).toBeUndefined();
      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.execute).toHaveBeenCalled();
      expect(mockRepository.where).toHaveBeenCalledWith('id = :id', {
        id: mocks.playerId,
      });
    });

    it('should throw error when player id is missing', async () => {
      await expect(playerService.removePlayer(NaN)).rejects.toThrow(
        new HttpException('Missing player id', HttpStatus.BAD_REQUEST),
      );
    });

    it('should handle errors', async () => {
      mockRepository.execute.mockRejectedValueOnce(new Error());
      await expect(playerService.removePlayer(mocks.playerId)).rejects.toThrow(
        new HttpException(
          'Server failed to remove player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

});
