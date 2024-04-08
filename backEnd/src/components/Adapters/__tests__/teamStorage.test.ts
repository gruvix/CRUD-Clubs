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
