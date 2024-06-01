import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import TeamService from '@comp/services/team.service';
import Player from '@comp/entities/player.entity';
import User from '@comp/entities/user.entity';
import TeamsService from '@comp/services/teams.service';
import CrestService from '@comp/services/crest.service';
import CrestController from '../crest.controller';
import { readFile } from 'fs/promises';

describe('CrestController', () => {
  let crestController: CrestController;
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;
  let crestService: CrestService;
  const userId = 1;
  const teamId = 1;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CrestController],
      providers: [
        CrestService,
        TeamService,
        PlayerService,
        UserService,
        TeamsService,
        { provide: getRepositoryToken(User), useValue: jest.fn() },
        { provide: getRepositoryToken(Team), useValue: jest.fn() },
        { provide: getRepositoryToken(Player), useValue: jest.fn() },
      ],
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
        await crestController.getCrest(userId, teamId, 'image.jpg'),
      ).toMatchObject({
        options: {
          length: imageFile.length,
        },
      });
      expect(crestService.getCrest).toHaveBeenCalledWith(userId, 'image.jpg');
    });

    it('should handle errors', async () => {
      jest.spyOn(crestService, 'getCrest').mockRejectedValueOnce(new Error());
      await expect(
        crestController.getCrest(userId, teamId, 'image.jpg'),
      ).rejects.toThrow(
        new HttpException(
          'Failed to get crest',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
