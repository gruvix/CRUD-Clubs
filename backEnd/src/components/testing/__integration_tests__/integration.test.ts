import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import MockTestUtils from '@comp/testing/MockTestUtils';
import mockRepository from '@comp/testing/mockTypeORMRepository';
import * as TypeORM from '@nestjs/typeorm';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import MockEntities from '../MockEntities';
import TeamService from '@comp/services/team.service';
import TeamController from '@comp/controllers/team.controller';
import UserController from '@comp/controllers/user.controller';
import UserService from '@comp/services/user.service';
import * as session from 'express-session';
import Team from '@comp/entities/team.entity';

describe('Integration tests', () => {
  let app: INestApplication;
  let teamService: TeamService;
  let userService: UserService;

  const mockGetRepositoryToken = jest
    .fn()
    .mockReturnValue(Symbol('MockedRepositoryToken'));

  jest
    .spyOn(TypeORM, 'getRepositoryToken')
    .mockImplementation(mockGetRepositoryToken);

  const mockUtils = new MockTestUtils();
  const mockEntities = new MockEntities();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

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

    teamService = module.get<TeamService>(TeamService);
    userService = module.get<UserService>(UserService);
  });

  describe('Team controller endpoints', () => {
    const userId = mockUtils.userId;

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
      //mocks to login

      const teamForTeamGuard = { user: { id: userId } };
      jest.spyOn(userService, 'getUserId').mockResolvedValueOnce(userId);
      jest
        .spyOn(teamService, 'getTeam')
        .mockResolvedValueOnce(teamForTeamGuard as unknown as Team);
      //mocks to bypass guards
    });

    describe('getTeam', () => {
      const teamId = 523;
      const requestUrl = `/user/team/${teamId}`;
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
        jest
        .spyOn(mockRepository, 'findOne')
        .mockResolvedValueOnce(null);

        await request(app.getHttpServer())
        .get(requestUrl)
        .set('Cookie', sessionCookie)
        .expect(404);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
