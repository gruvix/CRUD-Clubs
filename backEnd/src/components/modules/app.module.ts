import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SessionModule from './session.module';
import DatabaseModule from './database.module';
import 'dotenv/config';
import UserModule from './user.module';
import FootballModule from './football.module';

@Module({
  imports: [
    SessionModule,
    DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH,
      synchronize: process.env.PRODUCTION === 'false' ? true : false,
      autoLoadEntities: true,
      logging: true,
    }),
    UserModule,
    FootballModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
