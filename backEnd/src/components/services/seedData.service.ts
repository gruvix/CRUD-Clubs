import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readJSONFile } from '../storage/dataStorage';
import User from '../entities/user.entity';
import Team from '../entities/team.entity';
import Player from '../entities/player.entity';

@Injectable()
export default class SeedDataService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const JSONFolderPath = process.env.BASE_USER_FOLDER_PATH;
    const baseUser = await this.generateUserFromJSON(JSONFolderPath);
    const manager = this.userRepository.manager;
    await manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(baseUser);
    });
  }

  private async generateUserFromJSON(
    JSONFolderPath: string,
    username: string = 'default',
    password: string = 'default',
  ): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    user.teams = [];

    const teamsJSON = await readJSONFile(JSONFolderPath + '/teams.json');
    for (const teamId of Object.keys(teamsJSON)) {
      const teamJSON = await readJSONFile(
        JSONFolderPath + '/teams/' + teamId + '.json',
      );
      const newTeam = await this.createTeamFromJSON(teamJSON);
      user.teams.push(newTeam);
    }
    return user;
  }

  private async createTeamFromJSON(teamJSON: TeamJSON): Promise<Team> {
    const newTeam = new Team();
    newTeam.id = teamJSON.id;
    newTeam.name = teamJSON.name;
    newTeam.area = teamJSON.area.name;
    newTeam.address = teamJSON.address;
    newTeam.phone = teamJSON.phone;
    newTeam.website = teamJSON.website;
    newTeam.email = teamJSON.email;
    newTeam.venue = teamJSON.venue;
    newTeam.crestUrl = teamJSON.crestUrl;
    newTeam.hasDefault = true;
    newTeam.hasCustomCrest = teamJSON.hasCustomCrest || false;
    newTeam.squad = [];
    newTeam.updatedAt = teamJSON.lastUpdated;

    const players: PlayerJSON[] = teamJSON.squad;
    for (const player of players) {
      const newPlayer = await this.createPlayerFromJSON(player);
      newTeam.squad.push(newPlayer);
    }
    return newTeam;
  }
  private async createPlayerFromJSON(playerJSON: PlayerJSON): Promise<Player> {
    const newPlayer = new Player();
    newPlayer.id = playerJSON.id;
    newPlayer.name = playerJSON.name;
    newPlayer.position = playerJSON.position || playerJSON.role;
    newPlayer.nationality = playerJSON.nationality;
    return newPlayer;
  }
}
