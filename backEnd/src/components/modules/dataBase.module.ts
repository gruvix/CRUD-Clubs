import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import SeedDataService from '../services/seedData.service';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';
import DefaultTeam from '../entities/defaultTeam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, Player, DefaultTeam])],
  providers: [SeedDataService],
  exports: [SeedDataService],
})
export default class DatabaseModule {}
