import TeamListTeam from 'src/components/models/TeamListTeam';
import Player from '../../models/Player';
import TeamExtended from '../../models/TeamExtended';
import TeamStorageAdapter from '../teamStorage.adapter';

const adapter = new TeamStorageAdapter();
export default class mockUtils {
  defaultUsername = 'default';
  username = 'username';
  teamId = 1;
  playerId = 1;
  filePath = 'path/to/file' as never;
  newNameProp = { name: 'newName' };
  lastUpdated = new Date('0000-01-01T00:00:00Z');
  crestUrl = '/crest/url/file.png';

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
  private nonDefaultTeamMock = {
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
  };
  private defaultTeamMock = {
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
  };
  addNewPlayer(team: TeamExtended)
  {
    if (!team.squad.length) {
      team.squad.push(this.getNewPlayer(team.squad));
    } else {
      team.squad.unshift(this.getNewPlayer(team.squad));
    }
  }
  getNewPlayer(squad: Player[]) {
    return new Player({
      id: adapter.findNextFreePlayerId(squad),
      name: 'newname',
      position: 'newposition',
      dateOfBirth: 'newdateOfBirth',
      countryOfBirth: 'newcountryOfBirth',
      nationality: 'newnationality',
      role: 'newrole',
    });
  }
  cloneObject<T>(obj: T): any {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
  getDefaultTeamsList(): TeamListTeam[] {
    return this.cloneObject(this.defaultTeamsListMock);
  }
  getNonDefaultTeamsList(): TeamListTeam[] {
    return this.cloneObject(this.nonDefaultTeamsListMock);
  }
  getNonDefaultTeam(): TeamExtended {
    return this.cloneObject(this.nonDefaultTeamMock);
  }
  getDefaultTeam(): TeamExtended {
    return this.cloneObject(this.defaultTeamMock);
  }
}
