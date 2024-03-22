import { Module } from '@nestjs/common';
import { SessionModule } from 'nestjs-session';
import { UserService } from 'src/services/user.service';
import { TeamsController } from 'src/controllers/teams.controller';
import { UserController } from 'src/controllers/user.controller';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { getSessionsFolderPath } from 'src/components/userPath';

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
        cookie: { maxAge: 60 * 60 * 24, sameSite: 'none', secure: false },
      },
    }),
  ],
  controllers: [TeamsController, UserController],
  providers: [UserService],
})
export class AppModule {}
