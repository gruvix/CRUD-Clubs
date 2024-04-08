import TeamStorageAdapter from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
import * as ds from '../../storage/dataStorage';

const dsMock = ds as jest.Mocked<typeof ds>;
const adapter = new TeamStorageAdapter();

const defaultTeamMock = {
  1: {
    isDefault: true,
  },
};
const nonDefaultTeamMock = {
    1: {
      isDefault: false,
    },
  };
describe('isTeamDefault', () => {
  it('should return true when team is default', async () => {
    dsMock.readJSONFile.mockResolvedValue(defaultTeamMock);

    expect(await adapter.isTeamDefault('test', 1)).toEqual(true);
  });
  it('should return false when team is not default', async () => {
    dsMock.readJSONFile.mockResolvedValue(nonDefaultTeamMock);
    expect(await adapter.isTeamDefault('test', 1)).toEqual(false);
  });
});
