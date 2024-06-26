import Player from '@comp/entities/player.entity';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';
import TeamData from '@comp/interfaces/TeamData.interface';
import TeamShortDTO from '@comp/interfaces/TeamShortDTO.interface';
import TeamShort from '@comp/models/TeamShort';
import MockEntities from './MockEntities';
import DefaultTeam from '@comp/entities/defaultTeam.entity';

export default class MockTestUtils {
  mockEntities = new MockEntities();
  userId: number = 1;
  username: string = 'test';
  teamId: number = 1;
  password: string = 'test';
  crestFileName: string = 'image.jpg';
  oldCrestFileName: string = 'iAmOld.jpg';
  userRootPath: string = './fake/path/to/user/root';
  imageFilePath: string = './path/to/user/root/image.jpg';
  newCrestUrl: string = 'i/am/an/url';
  teamBody: any = {
    teamData: JSON.stringify({
      name: 'test',
      squad: [],
    }),
  };
  teamDataWithEmptySquad(): TeamData {
    return JSON.parse(
      JSON.stringify({
        id: this.teamId,
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        hasCustomCrest: true,
        defaultTeam: null,
        squad: [] as Player[],
      }),
    );
  }
  playerId: number = 1;
  playerData: PlayerData = {
    id: this.playerId,
    name: 'test name',
    position: 'test position',
    nationality: 'test land',
  };
  playerDataWithoutId: PlayerData = {
    id: undefined,
    name: 'test name',
    position: 'test position',
    nationality: 'test land',
  };
  userEntity(userId: number = this.userId): User {
    return JSON.parse(
      JSON.stringify({
        id: userId,
        username: this.username,
        password: this.password,
        teams: [],
        createdAt: undefined,
        updatedAt: undefined,
      }),
    );
  }
  TeamDTO(): TeamDTO {
    return JSON.parse(
      JSON.stringify({
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        hasCustomCrest: true,
        squad: [] as Player[],
        hasDefault: true,
      }),
    );
  }
  teamEntityWithEmptySquad(): Team {
    return JSON.parse(
      JSON.stringify({
        id: this.teamId,
        user: this.userId,
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        crestFileName: 'test',
        hasCustomCrest: true,
        squad: [],
        defaultTeam: 1,
        createdAt: undefined,
        updatedAt: undefined,
      }),
    );
  }
  defaultTeamEntity(
    teamId: number = this.teamId,
    userId: number = this.userId,
    squadAmount: number = 5,
  ): Team {
    return JSON.parse(
      JSON.stringify({
        id: teamId,
        user: userId,
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        crestFileName: null,
        hasCustomCrest: false,
        squad: this.squadGenerator(this.teamId, squadAmount),
        defaultTeam: null,
        createdAt: undefined,
        updatedAt: undefined,
      }),
    );
  }
  squadGenerator(teamId: number, playersAmount: number): Player[] {
    let squad = [];
    for (let i = 0; i < playersAmount; i++) {
      squad.push({
        id: i + 1,
        team: teamId,
        name: `test name ${i + 1}`,
        position: `test position ${i + 1}`,
        nationality: `test land ${i + 1}`,
        createdAt: undefined,
        updatedAt: undefined,
      });
    }
    return squad;
  }

  transformTeamShortToDTO(team: TeamShort): TeamShortDTO {
    const { defaultTeam, ...rest } = team;
    const teamDTO: TeamShortDTO = { ...rest, hasDefault: !!defaultTeam };
    return teamDTO;
  }

  generateTeamArray<Type>(
    amount: number,
    teamType: string,
    areDefault: boolean = true,
    userId: number = this.userId,
  ): Type[] {
    let teams: Type[] = [];
    for (let index = 1; index <= amount; index++) {
      switch (teamType) {
        case 'Team':
          teams.push(this.mockEntities.team(index, userId, areDefault) as Type);
          break;
        case 'TeamShort':
          teams.push(this.mockEntities.teamShort(index, areDefault) as Type);
          break;
        case 'TeamDTO':
          teams.push(this.mockEntities.teamDTO(areDefault) as Type);
          break;
        case 'TeamData':
          teams.push(this.mockEntities.teamData(index, areDefault) as Type);
          break;
        default:
          throw new Error('Unsupported type provided');
      }
    }
    return teams;
  }
  createTeamFromJSON(teamJSON: TeamJSON): Team {
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
      const newPlayer = this.createPlayerFromJSON(player);
      newTeam.squad.push(newPlayer);
    }
    return newTeam;
  }
  private createPlayerFromJSON(playerJSON: PlayerJSON): Player {
    const newPlayer = new Player();
    newPlayer.id = playerJSON.id;
    newPlayer.name = playerJSON.name;
    newPlayer.position = playerJSON.position || playerJSON.role;
    newPlayer.nationality = playerJSON.nationality;
    return newPlayer;
  }
  createDefaultTeam(team: Team): DefaultTeam {
    const defaultTeam = new DefaultTeam();
    defaultTeam.id = team.id;
    defaultTeam.teams = [team];
    return defaultTeam;
  }
  userRootPathFromId(userId: number): string {
    return `${this.userRootPath}/${userId}`;
  }
}
