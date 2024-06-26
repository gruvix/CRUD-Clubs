import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerController from '../player.controller';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import TeamsService from '@comp/services/teams.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let userService: UserService;
  let teamsService: TeamsService;
  let playerService: PlayerService;

  const mocks = new MockTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [PlayerController],
    }).compile();
    userService = module.get<UserService>(UserService);
    teamsService = module.get<TeamsService>(TeamsService);
    playerService = module.get<PlayerService>(PlayerService);
    playerController = module.get<PlayerController>(PlayerController);
  });

  describe('addPlayer', () => {
    it('should add a player to the database', async () => {
      jest.spyOn(playerService, 'addPlayer').mockResolvedValueOnce(void 0);

      expect(
        await playerController.addPlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerDataWithoutId,
        ),
      ).toBeUndefined();
      expect(playerService.addPlayer).toHaveBeenCalledWith(
        mocks.teamId,
        mocks.playerDataWithoutId,
      );
    });

    it('Should re-throw http exceptions', async () => {
      jest
        .spyOn(playerService, 'addPlayer')
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
        );
      await expect(
        playerController.addPlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerDataWithoutId,
        ),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
      );
    });

    it('should handle errors', async () => {
      jest.spyOn(playerService, 'addPlayer').mockRejectedValueOnce(new Error());
      await expect(
        playerController.addPlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerDataWithoutId,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to add player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(playerService.addPlayer).toHaveBeenCalledWith(
        mocks.teamId,
        mocks.playerDataWithoutId,
      );
    });
  });

  describe('updatePlayer', () => {
    it('should update a player', async () => {
      jest.spyOn(playerService, 'updatePlayer').mockResolvedValueOnce(void 0);

      expect(
        await playerController.updatePlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerData,
        ),
      ).toBeUndefined();
      expect(playerService.updatePlayer).toHaveBeenCalledWith(mocks.playerData);
    });

    it('Should re-throw http exceptions', async () => {
      jest
        .spyOn(playerService, 'updatePlayer')
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
        );
      await expect(
        playerController.updatePlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerData,
        ),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
      );
    });

    it('should handle errors', async () => {
      jest
        .spyOn(playerService, 'updatePlayer')
        .mockRejectedValueOnce(new Error());
      await expect(
        playerController.updatePlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerData,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(playerService.updatePlayer).toHaveBeenCalledWith(mocks.playerData);
    });
  });

  describe('removePlayer', () => {
    const playerDataMock: PlayerData = {
      id: 1,
      name: 'test name',
      position: 'test position',
      nationality: 'test land',
    };

    it('should delete a player', async () => {
      jest.spyOn(playerService, 'removePlayer').mockResolvedValueOnce(void 0);
      expect(
        await playerController.removePlayer(
          mocks.userId,
          mocks.teamId,
          playerDataMock,
        ),
      ).toBeUndefined();
      expect(playerService.removePlayer).toHaveBeenCalledWith(
        playerDataMock.id,
      );
    });

    it('Should re-throw http exceptions', async () => {
      jest
        .spyOn(playerService, 'removePlayer')
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
        );
      await expect(
        playerController.removePlayer(
          mocks.userId,
          mocks.teamId,
          mocks.playerData,
        ),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.I_AM_A_TEAPOT),
      );
    });

    it('should handle errors', async () => {
      jest
        .spyOn(playerService, 'removePlayer')
        .mockRejectedValueOnce(new Error());
      await expect(
        playerController.removePlayer(
          mocks.userId,
          mocks.teamId,
          playerDataMock,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to remove player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(playerService.removePlayer).toHaveBeenCalledWith(
        playerDataMock.id,
      );
    });
  });
});
