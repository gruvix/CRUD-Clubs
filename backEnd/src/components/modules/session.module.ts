import { Module } from '@nestjs/common';
import { SessionModule as SessionModuleCore } from 'nestjs-session';
import * as sqlite3 from 'sqlite3';
import * as session from 'express-session';
import sqliteStoreFactory from 'express-session-sqlite';

const SqliteStore = sqliteStoreFactory(session);
const store = new SqliteStore({
  driver: sqlite3.Database,
  path: process.env.SESSION_DB_PATH,
  ttl: 1000 * 60 * 60 * 24,
});
console.log(process.env.SESSION_DB_PATH)
@Module({
  imports: [
    SessionModuleCore.forRoot({
      session: {
        store: store,
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
