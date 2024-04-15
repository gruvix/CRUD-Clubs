import TeamExtended from '../../models/TeamExtended';

export default class mockUtils {
  defaultUsername = 'default';
  username = 'username';
  teamId = 1;
  filePath = 'path/to/file' as never;
  newNameProp = { name: 'newName' };
  lastUpdated = new Date('0000-01-01T00:00:00Z');

  private defaultTeamsListMock = {
    [this.teamId]: {
      id: this.teamId,
      isDefault: true,
      hasDefault: true,
      lastUpdated: 'Long Time Ago',
    },
  };
  private nonDefaultTeamsListMock = {
    [this.teamId]: {
      id: this.teamId,
      isDefault: false,
      hasDefault: false,
      lastUpdated: 'Long Time Ago',
    },
  };
  private nonDefaultTeamMock = new TeamExtended({
    name: 'name',
    area: 'area',
    address: 'address',
    phone: 123456789,
    website: 'website',
    email: 'email',
    venue: 'venue',
    id: this.teamId,
    crestUrl: '/user/customCrest/0/0.png',
    squad: [
      {
        id: 1,
        name: 'name',
        position: 'position',
        dateOfBirth: 'dateOfBirth',
        countryOfBirth: 'countryOfBirth',
        nationality: 'nationality',
        role: 'role',
      },
    ],
    hasCustomCrest: true,
    isDefault: false,
    hasDefault: false,
    lastUpdated: '2024-04-11T21:47:40.430Z',
  });
  private defaultTeamMock = new TeamExtended({
    name: 'name',
    area: 'area',
    address: 'address',
    phone: 123456789,
    website: 'website',
    email: 'email',
    venue: 'venue',
    id: this.teamId,
    crestUrl: '/user/customCrest/0/0.png',
    squad: [
      {
        id: 1,
        name: 'name',
        position: 'position',
        dateOfBirth: 'dateOfBirth',
        countryOfBirth: 'countryOfBirth',
        nationality: 'nationality',
        role: 'role',
      },
    ],
    hasCustomCrest: false,
    isDefault: true,
    hasDefault: true,
    lastUpdated: '2024-04-11T21:47:40.430Z',
  });
  cloneObject<T>(obj: T): any {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
  getDefaultTeamsList() {
    return this.cloneObject(this.defaultTeamsListMock);
  }
  getNonDefaultTeamsList() {
    return this.cloneObject(this.nonDefaultTeamsListMock);
  }
  getNonDefaultTeam() {
    return this.cloneObject(this.nonDefaultTeamMock);
  }
  getDefaultTeam() {
    return this.cloneObject(this.defaultTeamMock);
  }
}
