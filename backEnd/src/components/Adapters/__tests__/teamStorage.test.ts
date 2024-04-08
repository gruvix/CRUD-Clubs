import TeamStorageAdapter from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
import * as ds from '../../storage/dataStorage';
import FileNotFoundError from '../../errors/FileNotFoundError';
jest.spyOn(console, 'log').getMockImplementation();

const dsMock = ds as jest.Mocked<typeof ds>;
const adapter = new TeamStorageAdapter();

const defaultTeamsListMock = {
  1: {
    isDefault: true,
  },
};
const nonDefaultTeamsListMock = {
    1: {
      isDefault: false,
    },
  };
describe('isTeamDefault', () => {
  it('should return true when team is default', async () => {
    dsMock.readJSONFile.mockResolvedValue(defaultTeamsListMock);

    expect(await adapter.isTeamDefault('test', 1)).toEqual(true);
  });
  it('should return false when team is not default', async () => {
    dsMock.readJSONFile.mockResolvedValue(nonDefaultTeamsListMock);
    expect(await adapter.isTeamDefault('test', 1)).toEqual(false);
  });
});
describe('getTeamsList', () => {
  it('should return a list of teams', async () => {
    dsMock.readJSONFile.mockResolvedValue(defaultTeamsListMock);
    expect(await adapter.getTeamsList('test')).toEqual(defaultTeamsListMock);
  });
  it('should handle errors', async () => {
    dsMock.readJSONFile.mockRejectedValue(new FileNotFoundError());
    await expect(adapter.getTeamsList('test')).rejects.toThrow(FileNotFoundError);
  });
});
