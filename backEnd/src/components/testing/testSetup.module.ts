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
import CrestStorageService from '@comp/services/crestStorage.service';
import mockRepository from './mockTypeORMRepository';

@Module({
  providers: [
    UserService,
    TeamService,
    TeamsService,
    PlayerService,
    CrestService,
    CrestStorageService,
    { provide: getRepositoryToken(User), useValue: mockRepository },
    { provide: getRepositoryToken(Team), useValue: mockRepository },
    { provide: getRepositoryToken(Player), useValue: mockRepository },
  ],
  exports: [
    UserService,
    TeamService,
    TeamsService,
    PlayerService,
    CrestService,
    CrestStorageService,
    { provide: getRepositoryToken(User), useValue: mockRepository },
    { provide: getRepositoryToken(Team), useValue: mockRepository },
    { provide: getRepositoryToken(Player), useValue: mockRepository },
  ],
})
export class TestSetupModule {}
