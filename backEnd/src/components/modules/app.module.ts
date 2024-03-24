import { Module } from '@nestjs/common';
import { SessionModule } from 'nestjs-session';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { getSessionsFolderPath } from 'src/components/storage/userPath';
import PlayerService from 'src/components/services/player.service';
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

@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        store: new (FileStore(session))({
          path: getSessionsFolderPath(),
          ttl: 60 * 60 * 24,
          logFn: () => {},
          reapInterval: 60 * 60,
        }),
        secret: 'keyboard-cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: 'strict',
          secure: false,
        },
      },
    }),
  ],
  controllers: [
    UserController,
    TeamsController,
    TeamController,
    PlayerController,
    NewTeamController,
    CrestController,
  ],
  providers: [UserService, TeamsService, TeamService, PlayerService, CrestService],
})
export class AppModule {}