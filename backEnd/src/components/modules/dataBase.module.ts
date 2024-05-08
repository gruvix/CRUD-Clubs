import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './src/userData/userData.db',
      entities: [User, Team, Player],
      synchronize: process.env.PRODUCTION === 'false' ? true : false,
      logging: true,
    }),
  ],
})
export default class DataBaseModule {}
