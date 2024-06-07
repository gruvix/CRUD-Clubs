import Player from '@comp/entities/player.entity';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';

export default class MockTestUtils {
  userId: number = 1;
  username: string = 'test';
  teamId: number = 1;
  crestFileName: string = 'image.jpg';
  oldCrestFileName: string = 'iAmOld.jpg';
  userRootPath: string = './path/to/user/root';
  newCrestUrl: string = 'i/am/an/url';
  teamBodyMock: any = {
    teamData: JSON.stringify({
      name: 'test',
      squad: [],
    }),
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
