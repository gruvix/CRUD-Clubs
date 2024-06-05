import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import UserService from '@comp/services/user.service';
import { TestSetupModule } from './testSetup.module';
import TeamService from '@comp/services/team.service';
import TeamController from '../team.controller';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';
import Player from '@comp/entities/player.entity';
import Team from '@comp/entities/team.entity';
import TeamData from '@comp/interfaces/TeamData.interface';

describe('TeamsController', () => {
  let teamController: TeamController;
  let teamService: TeamService;
  let userService: UserService;

  const teamId = 1;
  const userId = 1;
  const getTeamRelations = ['squad', 'defaultTeam'];

  const mockTeamDTO: TeamDTO = {
    name: 'test',
    area: 'test',
    address: 'test',
    phone: 'test',
    website: 'test',
    email: 'test',
    venue: 'test',
    crestUrl: 'test',
    hasCustomCrest: true,
    squad: [] as Player[],
    hasDefault: true,
  };

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [TeamController],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
    userService = module.get<UserService>(UserService);
    teamController = module.get<TeamController>(TeamController);
  });

  describe('getTeam', () => {
    it('should return a teamDTO', async () => {
      jest.spyOn(teamService, 'getTeam').mockResolvedValueOnce(new Team());
      jest
        .spyOn(teamService, 'transformTeamDataToDTO')
        .mockImplementationOnce(() => mockTeamDTO);
      expect(await teamController.getTeam(userId, teamId)).toEqual(mockTeamDTO);
      expect(teamService.getTeam).toHaveBeenCalledWith(
        teamId,
        getTeamRelations,
      );
      expect(teamService.transformTeamDataToDTO).toHaveBeenCalledWith(
        {} as Team,
      );
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'getTeam').mockRejectedValueOnce(new Error());
      await expect(teamController.getTeam(userId, teamId)).rejects.toThrow(
        new HttpException(
          'Failed to get team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw an error for team not found', async () => {
      jest
        .spyOn(teamService, 'getTeam')
        .mockRejectedValueOnce(
          new HttpException('Team not found', HttpStatus.BAD_REQUEST),
        );
      await expect(teamController.getTeam(userId, teamId)).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('updateTeam', () => {
    it('should update a team', async () => {
      jest.spyOn(teamService, 'updateTeam').mockResolvedValueOnce(void 0);
      expect(
        await teamController.updateTeam(userId, teamId, {} as TeamData),
      ).toEqual(void 0);
      expect(teamService.updateTeam).toHaveBeenCalledWith(teamId, {});
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'updateTeam').mockRejectedValueOnce(new Error());
      await expect(
        teamController.updateTeam(userId, teamId, {} as TeamData),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw an error for team not found', async () => {
      jest
        .spyOn(teamService, 'updateTeam')
        .mockRejectedValueOnce(
          new HttpException('Team not found', HttpStatus.BAD_REQUEST),
        );
      await expect(
        teamController.updateTeam(userId, teamId, {} as TeamData),
      ).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      jest.spyOn(teamService, 'deleteTeam').mockResolvedValueOnce(void 0);
      expect(await teamController.deleteTeam(userId, teamId)).toEqual(void 0);
      expect(teamService.deleteTeam).toHaveBeenCalledWith(userId, teamId);
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'deleteTeam').mockRejectedValueOnce(new Error());
      await expect(teamController.deleteTeam(userId, teamId)).rejects.toThrow(
        new HttpException(
          'Failed to delete team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw an error for team not found', async () => {
      jest
        .spyOn(teamService, 'deleteTeam')
        .mockRejectedValueOnce(
          new HttpException('Team not found', HttpStatus.BAD_REQUEST),
        );
      await expect(teamController.deleteTeam(userId, teamId)).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('resetTeam', () => {
    it('should reset a team', async () => {
      jest.spyOn(teamService, 'resetTeam').mockResolvedValueOnce(void 0);
      expect(await teamController.resetTeam(userId, teamId)).toEqual(void 0);
      expect(teamService.deleteTeam).toHaveBeenCalledWith(userId, teamId);
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'resetTeam').mockRejectedValueOnce(new Error());
      await expect(teamController.resetTeam(userId, teamId)).rejects.toThrow(
        new HttpException(
          'Failed to reset team',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw an error for team not found', async () => {
      jest
        .spyOn(teamService, 'resetTeam')
        .mockRejectedValueOnce(
          new HttpException('Team not found', HttpStatus.BAD_REQUEST),
        );
      await expect(teamController.resetTeam(userId, teamId)).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
