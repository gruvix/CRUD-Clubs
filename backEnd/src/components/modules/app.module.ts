import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SessionModule from './session.module';
import SeedDatabaseModule from './seedDatabase.module';
import UserModule from './user.module';
import FootballModule from './football.module';
import 'dotenv/config';

@Module({
  imports: [
    SessionModule,
    SeedDatabaseModule,
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
