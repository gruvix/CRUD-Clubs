import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as request from 'supertest';
import * as session from 'express-session';
import * as TypeORM from '@nestjs/typeorm';
import * as dataStorage from '@comp/storage/dataStorage';
import { INestApplication } from '@nestjs/common';
import MockEntities from '../MockEntities';
import TeamService from '@comp/services/team.service';
import TeamController from '@comp/controllers/team.controller';
import UserController from '@comp/controllers/user.controller';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import TeamData from '@comp/interfaces/TeamData.interface';
import PlayerService from '@comp/services/player.service';
import CrestStorageService from '@comp/services/crestStorage.service';
import { getUserImagePath } from '@comp/storage/userPath';
import Player from '@comp/entities/player.entity';

describe('Integration tests', () => {
  let app: INestApplication;
  let teamService: TeamService;
  let userService: UserService;
  let playerService: PlayerService;
  let crestStorageService: CrestStorageService;

  const mockGetRepositoryToken = jest
    .fn()
    .mockReturnValue(Symbol('MockedRepositoryToken'));

  jest
    .spyOn(TypeORM, 'getRepositoryToken')
    .mockImplementation(mockGetRepositoryToken);
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  const mockUtils = new MockTestUtils();
  const mockEntities = new MockEntities();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
      controllers: [TeamController, UserController],
      providers: [
        {
          provide: Symbol('MockedRepositoryToken'),
          useValue: mockRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
      }),
    );
    await app.init();

    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
    playerService = module.get<PlayerService>(PlayerService);
    teamService = module.get<TeamService>(TeamService);
    userService = module.get<UserService>(UserService);
  });

  describe('Team controller endpoints', () => {
    const userId = mockUtils.userId;
    const teamId = mockUtils.teamId;
    const requestUrl = `/user/team/${teamId}`;

    let sessionCookie = null;

    beforeEach(async () => {
      jest.spyOn(userService, 'findOrCreateUser').mockResolvedValueOnce(void 0);
      jest.spyOn(userService, 'getUserId').mockResolvedValueOnce(userId);

      await request(app.getHttpServer()).get('/user').expect(401);
      const loginResponse = await request(app.getHttpServer())
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          username: 'test',
        })
        .expect(201);
      const cookies = loginResponse.headers['set-cookie'] as any;
      expect(cookies).toBeDefined();
      sessionCookie = cookies.find((cookie: string) =>
        cookie.includes('connect.sid'),
      );
      await request(app.getHttpServer())
        .get('/user')
        .set('Cookie', sessionCookie)
        .expect(200);
      //login

      const teamForTeamGuard = { user: { id: userId } };
      jest.spyOn(userService, 'getUserId').mockResolvedValueOnce(userId);
      jest
        .spyOn(teamService, 'getTeam')
        .mockResolvedValueOnce(teamForTeamGuard as unknown as Team);
      //mocks to bypass guards
    });

    describe('getTeam', () => {
      const team = mockEntities.team(teamId, userId, false);

      it('Should return a non-default team', async () => {
        const expectedTeam = teamService.transformTeamDataToDTO(team);

        jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(team);
        jest.spyOn(teamService, 'transformTeamDataToDTO');

        const response = await request(app.getHttpServer())
          .get(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(200);
        expect(response.body).toEqual(expectedTeam);
        expect(teamService.getTeam).toHaveBeenCalledWith(teamId, [
          'squad',
          'defaultTeam',
        ]);
        expect(teamService.transformTeamDataToDTO).toHaveBeenCalledWith(team);
      });

      it('Should throw an error when database fails to retrieve team', async () => {
        jest
          .spyOn(mockRepository, 'findOne')
          .mockRejectedValueOnce(new Error("i'm an error"));

        await request(app.getHttpServer())
          .get(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(500);
      });

      it('Should throw an error when team is not found in database', async () => {
        jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(null);

        await request(app.getHttpServer())
          .get(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(404);
      });
    });

    describe('updateTeam', () => {
      it('Should update a team', async () => {
        const body = { id: teamId, name: 'new name' } as TeamData;

        jest.spyOn(teamService, 'updateTeam');

        await request(app.getHttpServer())
          .patch(requestUrl)
          .set('Content-Type', 'application/json')
          .send(body)
          .set('Cookie', sessionCookie)
          .expect(200);
        expect(teamService.updateTeam).toHaveBeenCalledWith(teamId, body);
        expect(mockRepository.set).toHaveBeenCalledWith(body);
      });

      it('Should return an internal server error when database fails to update team', async () => {
        const body = { id: teamId } as TeamData;

        mockRepository.execute.mockRejectedValueOnce(new Error("i'm an error"));
        jest.spyOn(teamService, 'updateTeam');

        await request(app.getHttpServer())
          .patch(requestUrl)
          .set('Content-Type', 'application/json')
          .send(body)
          .set('Cookie', sessionCookie)
          .expect(500);
        expect(teamService.updateTeam).toHaveBeenCalledWith(teamId, body);
      });
    });

    describe('deleteTeam', () => {
      const crestFileName = 'filename';
      const teamWithCrestData = {
        id: teamId,
        crestFileName,
        hasCustomCrest: true,
      } as Team;
      const imagePath = getUserImagePath(userId, crestFileName);
      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementation(async (callback) => {
          const transactionalEntityManager = null;
          await callback(transactionalEntityManager);
        });

      it('Should delete a team with a custom crest', async () => {
        jest.spyOn(teamService, 'deleteTeam');
        jest.spyOn(playerService, 'clearSquad');
        jest.spyOn(crestStorageService, 'deleteCrest');
        jest
          .spyOn(teamService, 'getTeam')
          .mockResolvedValueOnce(teamWithCrestData);
        jest.spyOn(dataStorage, 'deleteFile').mockResolvedValueOnce(void 0);

        await request(app.getHttpServer())
          .delete(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(200);
        expect(teamService.deleteTeam).toHaveBeenCalledWith(userId, teamId);

        expect(playerService.clearSquad).toHaveBeenCalledWith(teamId);
        expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
          userId,
          crestFileName,
        );
        expect(dataStorage.deleteFile).toHaveBeenCalledWith(imagePath);
        expect(mockRepository.from).toHaveBeenCalledWith(Player);
        expect(mockRepository.from).toHaveBeenCalledWith(Team);
      });

      it('Should return an internal server error when database fails to delete team', async () => {
        jest.spyOn(teamService, 'deleteTeam');
        jest
          .spyOn(playerService, 'clearSquad')
          .mockRejectedValueOnce(new Error('error'));
        jest.spyOn(crestStorageService, 'deleteCrest');
        jest.spyOn(dataStorage, 'deleteFile');

        await request(app.getHttpServer())
          .delete(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(500);
        expect(teamService.deleteTeam).toHaveBeenCalledWith(userId, teamId);
        expect(playerService.clearSquad).toHaveBeenCalledWith(teamId);
        expect(crestStorageService.deleteCrest).not.toHaveBeenCalled();
        expect(dataStorage.deleteFile).not.toHaveBeenCalled();
      });
    });

    describe('resetTeam', () => {
      const crestFileName = 'filename';

      const imagePath = getUserImagePath(userId, crestFileName);
      const defaultTeam = mockEntities.team(teamId, userId, true);
      const playerAmount = 5;
      defaultTeam.squad = mockEntities.squadGenerator(teamId, playerAmount);

      jest
        .spyOn(mockRepository.manager, 'transaction')
        .mockImplementation(async (callback) => {
          const transactionalEntityManager = null;
          await callback(transactionalEntityManager);
        });

      it('Should reset a team', async () => {
        const teamWithCrestAndDefaultData = {
          id: teamId,
          crestFileName,
          hasCustomCrest: true,
          defaultTeam: { id: teamId },
        } as unknown as Team;

        jest.spyOn(teamService, 'resetTeam');
        jest
          .spyOn(teamService, 'getTeam')
          .mockResolvedValueOnce(teamWithCrestAndDefaultData)
          .mockResolvedValueOnce(defaultTeam);
        jest.spyOn(playerService, 'clearSquad');
        jest.spyOn(playerService, 'copyPlayersToTeam');
        jest.spyOn(crestStorageService, 'deleteCrest');
        jest.spyOn(dataStorage, 'deleteFile').mockResolvedValueOnce(void 0);
        const copyPlayersToTeamMock = jest
          .spyOn(playerService, 'copyPlayersToTeam')
          .mockImplementationOnce((team, squad) => {
            expect(team).toEqual(expect.objectContaining({ squad: [] }));
          });

        await request(app.getHttpServer())
          .put(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(200);
        expect(teamService.resetTeam).toHaveBeenCalledWith(userId, teamId);
        expect(playerService.clearSquad).toHaveBeenCalledWith(teamId);
        expect(copyPlayersToTeamMock).toHaveBeenCalledWith(
          expect.objectContaining({ squad: [] }),
          defaultTeam.squad,
        );
        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({ id: teamId }),
        );
        expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
          userId,
          crestFileName,
        );
        expect(dataStorage.deleteFile).toHaveBeenCalledWith(imagePath);
      });

      it("Should return an unprocessable entity error when team doesn't have a default team", async () => {
        const teamWithCrestAndDefaultData = {
          id: teamId,
          crestFileName,
          hasCustomCrest: true,
          defaultTeam: null,
        } as Team;

        jest
          .spyOn(teamService, 'getTeam')
          .mockResolvedValueOnce(teamWithCrestAndDefaultData);

        await request(app.getHttpServer())
          .put(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(422);
      });

      it('Should return an internal server error when team service fails to reset team', async () => {
        jest.spyOn(teamService, 'resetTeam').mockRejectedValueOnce(new Error());
        await request(app.getHttpServer())
          .put(requestUrl)
          .set('Cookie', sessionCookie)
          .expect(500);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
