import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import TeamService from '@comp/services/team.service';
import TeamsService from '@comp/services/teams.service';
import CrestService from '@comp/services/crest.service';
import CrestController from '../crest.controller';
import { readFile } from 'fs/promises';
import { TestSetupModule } from '@comp/testing/testSetup.module';

describe('CrestController', () => {
  let crestController: CrestController;
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;
  let crestService: CrestService;
  const userId = 1;
  const teamId = 1;
  const imageFileName = 'image.jpg';

  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [CrestController],
    }).compile();
    teamsService = module.get<TeamsService>(TeamsService);
    userService = module.get<UserService>(UserService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    crestService = module.get<CrestService>(CrestService);
    crestController = module.get<CrestController>(CrestController);
  });

  describe('getCrest', () => {
    it('should get the image of the team', async () => {
      const imageFile = await readFile(
        './src/components/controllers/__fixtures__/image.jpg',
      );

      jest.spyOn(crestService, 'getCrest').mockResolvedValueOnce(imageFile);
      expect(
        await crestController.getCrest(userId, teamId, imageFileName),
      ).toMatchObject({
        options: {
          length: imageFile.length,
        },
      });
      expect(crestService.getCrest).toHaveBeenCalledWith(userId, imageFileName);
    });

    it('should handle errors', async () => {
      jest.spyOn(crestService, 'getCrest').mockRejectedValueOnce(new Error());
      await expect(
        crestController.getCrest(userId, teamId, imageFileName),
      ).rejects.toThrow(
        new HttpException(
          'Failed to get crest',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateCrest', () => {
    it('should update the image of the team', async () => {
      const newCrestUrl = 'i/am/an/url';
      jest
        .spyOn(crestService, 'updateCrest')
        .mockResolvedValueOnce(newCrestUrl);
      expect(await crestController.updateCrest(userId, teamId, imageFileName));
    });
    it('should handle errors', async () => {
      jest
        .spyOn(crestService, 'updateCrest')
        .mockRejectedValueOnce(new Error())
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
        );
      await expect(
        crestController.updateCrest(userId, teamId, imageFileName),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update crest',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      await expect(
        crestController.updateCrest(userId, teamId, imageFileName),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
