import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { readJSONFile } from '@comp/storage/dataStorage';
import User from '@comp/entities/user.entity';
import Team from '@comp/entities/team.entity';
import Player from '@comp/entities/player.entity';
import DefaultTeam from '@comp/entities/defaultTeam.entity';

@Injectable()
export default class SeedDataService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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

    const baseUser = await this.createUserFromJSON(JSONFolderPath);
    const defaultTeams = this.createDefaultTeamsList(baseUser.teams);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(baseUser);
      await queryRunner.manager.save(defaultTeams);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  createDefaultTeamsList(teams: Team[]): DefaultTeam[] {
    return teams.map((team) => {
      const defaultTeam = new DefaultTeam();
      defaultTeam.id = team.id;
      defaultTeam.teams = [team];
      return defaultTeam;
    });
  }

  private async createUserFromJSON(
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
