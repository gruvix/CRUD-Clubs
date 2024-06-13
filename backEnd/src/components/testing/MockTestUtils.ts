import Player from '@comp/entities/player.entity';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';
import TeamData from '@comp/interfaces/TeamData.interface';

export default class MockTestUtils {
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
  teamData: TeamData = {
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
  };
  teamEntity: Team = {
    
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
  userEntity: User = {
    id: this.userId,
    username: this.username,
    password: this.password,
    teams: [],
    createdAt: undefined,
    updatedAt: undefined,
  };
  TeamDTO: TeamDTO = {
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
  };
  TeamWithEmptySquad(): Team {
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
  userRootPathFromId(userId: number): string {
    return `${this.userRootPath}/${userId}`;
  }
}
