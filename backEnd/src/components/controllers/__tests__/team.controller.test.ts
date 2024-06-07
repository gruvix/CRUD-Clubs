import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import UserService from '@comp/services/user.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import TeamService from '@comp/services/team.service';
import TeamController from '../team.controller';
import Team from '@comp/entities/team.entity';
import TeamData from '@comp/interfaces/TeamData.interface';
import MockTestUtils from '@comp/testing/MockTestUtils';

describe('TeamsController', () => {
  let teamController: TeamController;
  let teamService: TeamService;
  let userService: UserService;

  const mocks = new MockTestUtils();
  const getTeamRelations = ['squad', 'defaultTeam'];

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
        .mockImplementationOnce(() => mocks.TeamDTO);
      expect(await teamController.getTeam(mocks.userId, mocks.teamId)).toEqual(mocks.TeamDTO);
      expect(teamService.getTeam).toHaveBeenCalledWith(
        mocks.teamId,
        getTeamRelations,
      );
      expect(teamService.transformTeamDataToDTO).toHaveBeenCalledWith(
        {} as Team,
      );
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'getTeam').mockRejectedValueOnce(new Error());
      await expect(teamController.getTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
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
      await expect(teamController.getTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('updateTeam', () => {
    it('should update a team', async () => {
      jest.spyOn(teamService, 'updateTeam').mockResolvedValueOnce(void 0);
      expect(
        await teamController.updateTeam(mocks.userId, mocks.teamId, {} as TeamData),
      ).toEqual(void 0);
      expect(teamService.updateTeam).toHaveBeenCalledWith(mocks.teamId, {});
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'updateTeam').mockRejectedValueOnce(new Error());
      await expect(
        teamController.updateTeam(mocks.userId, mocks.teamId, {} as TeamData),
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
        teamController.updateTeam(mocks.userId, mocks.teamId, {} as TeamData),
      ).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      jest.spyOn(teamService, 'deleteTeam').mockResolvedValueOnce(void 0);
      expect(await teamController.deleteTeam(mocks.userId, mocks.teamId)).toEqual(void 0);
      expect(teamService.deleteTeam).toHaveBeenCalledWith(mocks.userId, mocks.teamId);
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'deleteTeam').mockRejectedValueOnce(new Error());
      await expect(teamController.deleteTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
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
      await expect(teamController.deleteTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('resetTeam', () => {
    it('should reset a team', async () => {
      jest.spyOn(teamService, 'resetTeam').mockResolvedValueOnce(void 0);
      expect(await teamController.resetTeam(mocks.userId, mocks.teamId)).toEqual(void 0);
      expect(teamService.resetTeam).toHaveBeenCalledWith(mocks.userId, mocks.teamId);
    });

    it('should throw an internal server error', async () => {
      jest.spyOn(teamService, 'resetTeam').mockRejectedValueOnce(new Error());
      await expect(teamController.resetTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
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
      await expect(teamController.resetTeam(mocks.userId, mocks.teamId)).rejects.toThrow(
        new HttpException('Team not found', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
