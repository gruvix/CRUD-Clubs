import { Module } from '@nestjs/common';
import { SessionModule } from 'nestjs-session';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { getSessionsFolderPath } from 'src/components/userPath';
import PlayerService from 'src/services/player.service';
import UserController from 'src/controllers/user.controller';
import TeamsController from 'src/controllers/teams.controller';
import TeamController from 'src/controllers/team.controller';
import PlayerController from 'src/controllers/player.controller';
import TeamService from 'src/services/team.service';
import TeamsService from 'src/services/teams.service';
import UserService from 'src/services/user.service';

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
  ],
  providers: [UserService, TeamsService, TeamService, PlayerService],
})
export class AppModule {}
