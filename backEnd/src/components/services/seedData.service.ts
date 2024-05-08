import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readJSONFile } from '../storage/dataStorage';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';
import TeamExtended from '../models/TeamExtended';
import * as PlayerJSON from '../models/Player';

@Injectable()
export default class SeedDataService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}
  async onModuleInit() {
    const valueExists = await this.userRepository
      .findOneBy({ username: 'default' })
      .then();
    if (!valueExists) {
      await this.seedBaseTeams();
    }
  }

  private async seedBaseTeams(): Promise<void> {
  private async generateUserFromJSON(
    username: string = 'default',
    password: string = 'default',
  ): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    const JSONFolderPath = process.env.BASE_USER_FOLDER_PATH;
    const teamsJSON = await readJSONFile(JSONFolderPath);

    teamsJSON.forEach(async (team: TeamExtended) => {
      const newTeam = new Team();
      const teamJSON = await readJSONFile(
        JSONFolderPath + '/' + team.id + '.json',
      );
      newTeam.id = teamJSON.id;
      newTeam.name = teamJSON.name;
      newTeam.area = teamJSON.area.name;
      newTeam.address = teamJSON.address;
      newTeam.phone = teamJSON.phone;
      newTeam.website = teamJSON.website;
      newTeam.email = teamJSON.email;
      newTeam.venue = teamJSON.venue;
      newTeam.crestUrl = teamJSON.crestUrl;
      newTeam.hasCustomCrest = teamJSON.hasCustomCrest;
      newTeam.squad = [];
      newTeam.updatedAt = teamJSON.lastUpdated;

      const players = teamJSON.squad;
      players.forEach(async (player: PlayerJSON.default) => {
        const newPlayer = new Player();
        newPlayer.id = player.id;
        newPlayer.name = player.name;
        newPlayer.position = player.position || player.role;
        newPlayer.nationality = player.nationality;
        newTeam.squad.push(newPlayer);
      });
      user.teams.push(newTeam);
    });
    return user;
  }
}
