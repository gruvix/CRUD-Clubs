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
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';
import CrestStorageService from '@comp/services/crestStorage.service';

describe('CrestController', () => {
  let crestController: CrestController;
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;
  let crestService: CrestService;
  let crestStorageService: CrestStorageService;

  const mocks = new MockTestUtils();
  const paths = new PathTestUtils();

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
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });

  describe('getCrest', () => {
    it('should get the image of the team', async () => {
      const imageFile = await readFile(paths.fixtureImagePath);

      jest.spyOn(crestStorageService, 'getCrest').mockResolvedValueOnce(imageFile);
      expect(
        await crestController.getCrest(
          mocks.userId,
          mocks.teamId,
          mocks.crestFileName,
        ),
      ).toMatchObject({
        options: {
          length: imageFile.length,
        },
      });
      expect(crestStorageService.getCrest).toHaveBeenCalledWith(
        mocks.userId,
        mocks.crestFileName,
      );
    });

    it('should handle errors', async () => {
      jest.spyOn(crestStorageService, 'getCrest').mockRejectedValueOnce(new Error());
      await expect(
        crestController.getCrest(
          mocks.userId,
          mocks.teamId,
          mocks.crestFileName,
        ),
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
      jest
        .spyOn(crestService, 'updateCrest')
        .mockResolvedValueOnce(mocks.newCrestUrl);
      expect(
        await crestController.updateCrest(
          mocks.userId,
          mocks.teamId,
          mocks.crestFileName,
        ),
      );
    });
    it('should handle errors', async () => {
      jest
        .spyOn(crestService, 'updateCrest')
        .mockRejectedValueOnce(new Error())
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
        );
      await expect(
        crestController.updateCrest(
          mocks.userId,
          mocks.teamId,
          mocks.crestFileName,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update crest',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      await expect(
        crestController.updateCrest(
          mocks.userId,
          mocks.teamId,
          mocks.crestFileName,
        ),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
