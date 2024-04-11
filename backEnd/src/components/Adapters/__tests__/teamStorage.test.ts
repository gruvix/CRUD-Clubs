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

const defaultUsername = 'default';
const username = 'username';
const teamId = 1;
const filePath = 'path/to/file' as never;

const defaultTeamsListMock = {
  [teamId]: {
    id: teamId,
    isDefault: true,
    hasDefault: true,
  },
};
const nonDefaultTeamsListMock = {
  [teamId]: {
    id: teamId,
    isDefault: false,
    hasDefault: false,
  },
};
const nonDefaultTeamMock = new TeamExtended({
  id: teamId,
  name: 'name',
  area: 'area',
  address: 'address',
  phone: 123456789,
  website: 'website',
  email: 'email',
  venue: 'venue',
  squad: [],
  lastUpdated: 'A long time ago',
  hasCustomCrest: false,
  isDefault: false,
  hasDefault: false,
  crestUrl: '',
} as any);
const defaultTeamMock = new TeamExtended({
  id: teamId,
  name: 'name',
  area: 'area',
  address: 'address',
  phone: 123456789,
  website: 'website',
  email: 'email',
  venue: 'venue',
  squad: [],
  lastUpdated: 'A long time ago',
  hasCustomCrest: false,
  isDefault: true,
  hasDefault: true,
  crestUrl: '',
} as any);
beforeAll(() => {
  userPathMock.getUserTeamsListJSONPath.mockReturnValue(filePath);
  userPathMock.getUserTeamJSONPath.mockReturnValue(filePath);
});
afterEach(() => {
  dataStorageMock.readJSONFile.mockClear();
  dataStorageMock.writeFile.mockClear();
});
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
describe('getTeam', () => {
  it('should return a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock)
      .mockResolvedValueOnce(nonDefaultTeamMock)
      .mockResolvedValueOnce(nonDefaultTeamsListMock);
    const result = await adapter.getTeam(username, teamId);
    expect(result).toEqual(nonDefaultTeamMock);
  });
  it('should return a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockResolvedValueOnce(defaultTeamMock)
      .mockResolvedValueOnce(defaultTeamsListMock);
    const result = await adapter.getTeam(username, teamId);
    expect(result).toEqual(defaultTeamMock);
  });

  it('should handle errors', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockRejectedValueOnce(new FileNotFoundError());
    await expect(adapter.getTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockResolvedValueOnce(defaultTeamMock)
      .mockRejectedValueOnce(new FileNotFoundError());
    await expect(adapter.getTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('copyTeamListTeam', () => {
  it('should copy a team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockResolvedValueOnce(nonDefaultTeamsListMock);
    dataStorageMock.writeFile.mockResolvedValue(undefined as never);
    await adapter.copyTeamListTeam(defaultUsername, username, teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamsListMock),
    );
  });
  it('should handle same source and target users', async () => {
    await expect(
      adapter.copyTeamListTeam(defaultUsername, defaultUsername, 1),
    ).rejects.toThrow('Source and target users must be different');
  });
});
describe('copyTeamsList', () => {
  it('should copy a list of teams', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    dataStorageMock.writeFile.mockResolvedValue(undefined as never);
    await adapter.copyTeamsList(defaultUsername, username);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamsListMock),
    );
  });
  it('should handle same source and target users situation', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    await expect(
      adapter.copyTeamsList(defaultUsername, defaultUsername),
    ).rejects.toThrow('Source and target users must be different');
  });
});
});
