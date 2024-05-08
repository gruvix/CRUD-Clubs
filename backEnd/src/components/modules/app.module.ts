import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PlayerService from 'src/components/services/player.service';
import SessionModule from './session.module';
import UserController from 'src/components/controllers/user.controller';
import TeamsController from 'src/components/controllers/teams.controller';
import TeamController from 'src/components/controllers/team.controller';
import PlayerController from 'src/components/controllers/player.controller';
import TeamService from 'src/components/services/team.service';
import TeamsService from 'src/components/services/teams.service';
import UserService from 'src/components/services/user.service';
import NewTeamController from '../controllers/newTeam.controller';
import CrestController from '../controllers/crest.controller';
import CrestService from '../services/crest.service';
import Team from '../entities/team.entity';
import 'dotenv/config';
import User from '../entities/user.entity';
import Player from '../entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './src/userData/userData.db',
      entities: [Team, User, Player],
      synchronize: process.env.PRODUCTION === 'false' ? true : false,
      logging: true,
    }),
    SessionModule,
  ],
  controllers: [
    UserController,
    TeamsController,
    TeamController,
    PlayerController,
    NewTeamController,
    CrestController,
  ],
  providers: [
    UserService,
    TeamsService,
    TeamService,
    PlayerService,
    CrestService,
  ],
})
export class AppModule {}
