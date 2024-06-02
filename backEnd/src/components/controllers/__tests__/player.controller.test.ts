import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerController from '../player.controller';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import TeamsService from '@comp/services/teams.service';
import { TestSetupModule } from './testSetup.module';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let userService: UserService;
  let teamsService: TeamsService;
  let playerService: PlayerService;

  const userId = 1;
  const teamId = 1;

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
    const playerDataMock: PlayerData = {
      id: undefined,
      name: 'test name',
      position: 'test position',
      nationality: 'test land',
    };

    it('should add a player to the database', async () => {
      jest.spyOn(playerService, 'addPlayer').mockResolvedValueOnce(void 0);

      expect(
        await playerController.addPlayer(userId, teamId, playerDataMock),
      ).toBeUndefined();
      expect(playerService.addPlayer).toHaveBeenCalledWith(
        teamId,
        playerDataMock,
      );
    });

    it('should handle errors', async () => {
      jest.spyOn(playerService, 'addPlayer').mockRejectedValueOnce(new Error());
      await expect(
        playerController.addPlayer(userId, teamId, playerDataMock),
      ).rejects.toThrow(
        new HttpException(
          'Failed to add player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(playerService.addPlayer).toHaveBeenCalledWith(
        teamId,
        playerDataMock,
      );
    });
  });

  describe('updatePlayer', () => {
    const playerDataMock: PlayerData = {
      id: 1,
      name: 'test name',
      position: 'test position',
      nationality: 'test land',
    };

    it('should update a player', async () => {
      jest.spyOn(playerService, 'updatePlayer').mockResolvedValueOnce(void 0);

      expect(
        await playerController.updatePlayer(userId, teamId, playerDataMock),
      ).toBeUndefined();
      expect(playerService.updatePlayer).toHaveBeenCalledWith(playerDataMock);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(playerService, 'updatePlayer')
        .mockRejectedValueOnce(new Error());
      await expect(
        playerController.updatePlayer(userId, teamId, playerDataMock),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(playerService.updatePlayer).toHaveBeenCalledWith(playerDataMock);
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
      expect(await playerController.removePlayer(userId, teamId, playerDataMock)).toBeUndefined();
      expect(playerService.removePlayer).toHaveBeenCalledWith(playerDataMock.id)
    })
    it('should handle errors', async () => {
      jest.spyOn(playerService, 'removePlayer').mockRejectedValueOnce(new Error());
      await expect(
        playerController.removePlayer(userId, teamId, playerDataMock),
      ).rejects.toThrow(
        new HttpException(
          'Failed to remove player',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(playerService.removePlayer).toHaveBeenCalledWith(playerDataMock.id);
    })
  })
});
