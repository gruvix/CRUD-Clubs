import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerController from '../player.controller';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import TeamService from '@comp/services/team.service';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let userService: UserService;
  let teamService: TeamService;
  let playerService: PlayerService;

  const userId = 1;
  const teamId = 1;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        UserService,
        TeamService,
        { provide: getRepositoryToken(Team), useValue: jest.fn() },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    teamService = module.get<TeamService>(TeamService);
    playerService = module.get<PlayerService>(PlayerService);
    playerController = module.get<PlayerController>(PlayerController);
  });

});
