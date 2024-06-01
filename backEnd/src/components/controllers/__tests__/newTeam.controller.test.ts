import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import TeamService from '@comp/services/team.service';
import NewTeamController from '../newTeam.controller';
import Player from '@comp/entities/player.entity';
import User from '@comp/entities/user.entity';
import TeamsService from '@comp/services/teams.service';

describe('NewTeamController', () => {
  let newTeamController: NewTeamController;
  let userService: UserService;
  let teamService: TeamService;
  let teamsService: TeamsService;
  let playerService: PlayerService;

  const userId = 1;
  const crestImageFilename = 'image.jpg';
  const bodyMock = {
    teamData: JSON.stringify({
      name: 'test',
      squad: [],
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NewTeamController],
      providers: [
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
    newTeamController = module.get<NewTeamController>(NewTeamController);
  });
  describe('addTeam', () => {
    it('should add a team to the database', async () => {
      const NEW_TEAM_ID = 5000;
      jest.spyOn(teamService, 'addTeam').mockResolvedValueOnce(NEW_TEAM_ID);
      expect(
        await newTeamController.addTeam(userId, bodyMock, crestImageFilename),
      ).toBe(NEW_TEAM_ID);
      expect(teamService.addTeam).toHaveBeenCalledWith(
        userId,
        JSON.parse(bodyMock.teamData),
        'image.jpg',
      );
    });

    it('should handle errors from adding a team', async () => {
      jest
        .spyOn(teamService, 'addTeam')
        .mockRejectedValueOnce(new Error())
        .mockRejectedValueOnce(
          new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
        );
      await expect(
        newTeamController.addTeam(userId, bodyMock, crestImageFilename),
      ).rejects.toThrow(
        new HttpException(
          'Failed to add team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      await expect(
        newTeamController.addTeam(userId, bodyMock, crestImageFilename),
      ).rejects.toThrow(
        new HttpException('Im a test error', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
