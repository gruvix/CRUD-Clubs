import { Module } from '@nestjs/common';
import SessionModule from './session.module';
import DatabaseModule from './database.module';

import UserController from 'src/components/controllers/user.controller';
import TeamsController from 'src/components/controllers/teams.controller';
import TeamController from 'src/components/controllers/team.controller';
import PlayerController from 'src/components/controllers/player.controller';
import NewTeamController from '../controllers/newTeam.controller';
import CrestController from '../controllers/crest.controller';

import UserService from 'src/components/services/user.service';
import PlayerService from 'src/components/services/player.service';
import TeamService from 'src/components/services/team.service';
import TeamsService from 'src/components/services/teams.service';
import CrestService from '../services/crest.service';

import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserModule from './user.module';

@Module({
  imports: [
    SessionModule,
    DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './src/userData/userData.db',
      synchronize: process.env.PRODUCTION === 'false' ? true : false,
      autoLoadEntities: true,
      logging: true,
    }),
    UserModule,
  ],
  controllers: [
    TeamsController,
    TeamController,
    PlayerController,
    NewTeamController,
    CrestController,
  ],
  providers: [
    TeamsService,
    TeamService,
    PlayerService,
    CrestService,
  ],
})
export class AppModule {}
