import { Module } from '@nestjs/common';
import { SessionModule as SessionModuleCore} from 'nestjs-session';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { getSessionsFolderPath } from 'src/components/storage/userPath';


@Module({
  imports: [
    SessionModuleCore.forRoot({
      session: {
        store: new (FileStore(session))({
          path: getSessionsFolderPath(),
          ttl: 60 * 60 * 24,
          logFn: () => {},
          reapInterval: 60 * 60,
        }),
        secret: process.env.SECRET_KEY,
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
})
export default class SessionModule {}
