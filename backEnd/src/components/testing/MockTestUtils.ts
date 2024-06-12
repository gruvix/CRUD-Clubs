import Player from '@comp/entities/player.entity';
import User from '@comp/entities/user.entity';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';

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
  playerId: number = 1;
  playerData: PlayerData = {
    id: 1,
    name: 'test name',
    position: 'test position',
    nationality: 'test land',
  }
  playerDataWithoutId: PlayerData = {
    id: undefined,
    name: 'test name',
    position: 'test position',
    nationality: 'test land',
  }
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
  userRootPathFromId(userId: number): string {
    return `${this.userRootPath}/${userId}`;
  }
}
