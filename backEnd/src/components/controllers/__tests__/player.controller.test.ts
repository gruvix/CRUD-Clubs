import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerController from '../player.controller';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import Player from '@comp/entities/player.entity';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import User from '@comp/entities/user.entity';
import TeamsService from '@comp/services/teams.service';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let userService: UserService;
  let teamsService: TeamsService;
  let playerService: PlayerService;

  const username = 'test';
  const userId = 1;
  const teamId = 1;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        UserService,
        TeamsService,
        { provide: getRepositoryToken(User), useValue: jest.fn() },
        { provide: getRepositoryToken(Team), useValue: jest.fn() },
        { provide: getRepositoryToken(Player), useValue: jest.fn() },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    teamsService = module.get<TeamsService>(TeamsService);
    playerService = module.get<PlayerService>(PlayerService);
    playerController = module.get<PlayerController>(PlayerController);
  });

});
