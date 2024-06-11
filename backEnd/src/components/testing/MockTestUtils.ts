import Player from '@comp/entities/player.entity';
import User from '@comp/entities/user.entity';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';

export default class MockTestUtils {
  userId: number = 1;
  username: string = 'test';
  teamId: number = 1;
  password: string = 'test';
  crestFileName: string = 'image.jpg';
  oldCrestFileName: string = 'iAmOld.jpg';
  userRootPath: string = './path/to/user/root';
  imageFilePath: string = './path/to/user/root/image.jpg';
  newCrestUrl: string = 'i/am/an/url';
  teamBody: any = {
    teamData: JSON.stringify({
      name: 'test',
      squad: [],
    }),
  };
  userEntity: User = {
    id: this.userId,
    username: this.username,
    password: this.password,
    teams: [],
    createdAt: new Date(),
    updatedAt: new Date(),
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
}
