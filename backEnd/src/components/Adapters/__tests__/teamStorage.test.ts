import TeamStorageAdapter from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
jest.mock('../../storage/userPath');
import * as ds from '../../storage/dataStorage';
import * as us from '../../storage/userPath';
import FileNotFoundError from '../../errors/FileNotFoundError';
import TeamExtended from '../../models/TeamExtended';
jest.spyOn(console, 'log').getMockImplementation();

const dataStorageMock = ds as jest.Mocked<typeof ds>;
const userPathMock = us as jest.Mocked<typeof us>;
const adapter = new TeamStorageAdapter();

const username = 'username';
const teamId = 1;

const defaultTeamsListMock = {
  [teamId]: {
    isDefault: true,
    hasDefault: true,
  },
};
const nonDefaultTeamsListMock = {
  [teamId]: {
    isDefault: false,
    hasDefault: false,
  },
};
const nonDefaultTeamMock = new TeamExtended({
  id: teamId,
  name: 'name',
  squad: [],
  lastUpdated: '',
  hasCustomCrest: false,
  isDefault: false,
  hasDefault: false,
  crestUrl: '',
} as any);
const defaultTeamMock = new TeamExtended({
  id: teamId,
  name: 'name',
  squad: [],
  lastUpdated: '',
  hasCustomCrest: false,
  isDefault: true,
  hasDefault: true,
  crestUrl: '',
} as any);
describe('isTeamDefault', () => {
  it('should return true when team is default', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(defaultTeamsListMock);

    expect(await adapter.isTeamDefault(username, teamId)).toEqual(true);
  });
  it('should return false when team is not default', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(nonDefaultTeamsListMock);
    expect(await adapter.isTeamDefault(username, teamId)).toEqual(false);
  });
});
describe('getTeamsList', () => {
  it('should return a list of teams', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(defaultTeamsListMock);
    expect(await adapter.getTeamsList(username)).toEqual(defaultTeamsListMock);
  });
  it('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockRejectedValue(new FileNotFoundError());
    await expect(adapter.getTeamsList(username)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
  });
});
