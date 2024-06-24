import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';
import UserService from '../services/user.service';
import UserController from '../controllers/user.controller';
import TeamsService from '@comp/services/teams.service';
import PlayerService from '@comp/services/player.service';
import CrestStorageService from '@comp/services/crestStorage.service';
import TeamService from '@comp/services/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, Player])],
  controllers: [UserController],
  providers: [UserService, TeamsService, TeamService, PlayerService, CrestStorageService],
  exports: [UserService],
})
export default class UserModule {}
