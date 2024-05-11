import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserService from '../services/user.service';
import TeamsController from '../controllers/teams.controller';
import TeamController from '../controllers/team.controller';
import PlayerController from '../controllers/player.controller';
import TeamsService from '../services/teams.service';
import PlayerService from '../services/player.service';
import TeamService from '../services/team.service';
import NewTeamController from '../controllers/newTeam.controller';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';
import CrestController from '../controllers/crest.controller';
import CrestService from '../services/crest.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, Player])],
  controllers: [
    TeamsController,
    TeamController,
    PlayerController,
    NewTeamController,
    CrestController,
  ],
  providers: [UserService, TeamsService, TeamService, PlayerService, CrestService],
  exports: [UserService, TeamsService, TeamService, PlayerService, CrestService],
})
export default class FootBallModule {}
