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
import { SessionModule as SessionModuleCore } from 'nestjs-session';
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
  });
});
