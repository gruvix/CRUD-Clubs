import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import PlayerService from '@comp/services/player.service';
import UserService from '@comp/services/user.service';
import Team from '@comp/entities/team.entity';
import TeamService from '@comp/services/team.service';
import Player from '@comp/entities/player.entity';
import User from '@comp/entities/user.entity';
import TeamsService from '@comp/services/teams.service';
import CrestService from '@comp/services/crest.service';
@Module({
  providers: [
    UserService,
    TeamService,
    TeamsService,
    PlayerService,
    CrestService,
    { provide: getRepositoryToken(User), useValue: jest.fn() },
    { provide: getRepositoryToken(Team), useValue: jest.fn() },
    { provide: getRepositoryToken(Player), useValue: jest.fn() },
  ],
  exports: [
    UserService,
    TeamService,
    TeamsService,
    PlayerService,
    CrestService,
    { provide: getRepositoryToken(User), useValue: jest.fn() },
    { provide: getRepositoryToken(Team), useValue: jest.fn() },
    { provide: getRepositoryToken(Player), useValue: jest.fn() },
  ],
})
export class TestSetupModule {}
