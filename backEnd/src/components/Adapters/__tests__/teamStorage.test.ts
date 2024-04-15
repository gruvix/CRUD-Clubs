import TeamStorageAdapter from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
jest.mock('../../storage/userPath');
import * as ds from '../../storage/dataStorage';
import * as us from '../../storage/userPath';
import FileNotFoundError from '../../errors/FileNotFoundError';
import TeamExtended from '../../models/TeamExtended';
import TeamListTeam from 'src/components/models/TeamListTeam';
jest.spyOn(console, 'log').getMockImplementation();
const lastUpdated = new Date('0000-01-01T00:00:00Z');
jest.useFakeTimers().setSystemTime(lastUpdated);

const dataStorageMock = ds as jest.Mocked<typeof ds>;
const userPathMock = us as jest.Mocked<typeof us>;
const adapter = new TeamStorageAdapter();

const defaultUsername = 'default';
const username = 'username';
const teamId = 1;
const filePath = 'path/to/file' as never;
const newNameProp = { name: 'newName' };

const defaultTeamsListMock = {
  [teamId]: {
    id: teamId,
    isDefault: true,
    hasDefault: true,
    lastUpdated: 'Long Time Ago',
  },
};
const nonDefaultTeamsListMock = {
  [teamId]: {
    id: teamId,
    isDefault: false,
    hasDefault: false,
    lastUpdated: 'Long Time Ago',
  },
};
const nonDefaultTeamMock = new TeamExtended({
  name: 'name',
  area: 'area',
  address: 'address',
  phone: 123456789,
  website: 'website',
  email: 'email',
  venue: 'venue',
  id: teamId,
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
const defaultTeamMock = new TeamExtended({
  name: 'name',
  area: 'area',
  address: 'address',
  phone: 123456789,
  website: 'website',
  email: 'email',
  venue: 'venue',
  id: teamId,
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
function cloneObject<T>(obj: T): any {
  return JSON.parse(JSON.stringify(obj)) as T;
}
beforeEach(() => {
  jest.resetAllMocks();
  userPathMock.getUserTeamsListJSONPath.mockReturnValue(filePath);
  userPathMock.getUserTeamJSONPath.mockReturnValue(filePath);
  dataStorageMock.writeFile.mockResolvedValue(undefined as never);
});
describe('isTeamDefault', () => {
  test('should return true when team is default', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(defaultTeamsListMock);

    expect(await adapter.isTeamDefault(username, teamId)).toEqual(true);
  });
  test('should return false when team is not default', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(nonDefaultTeamsListMock);
    expect(await adapter.isTeamDefault(username, teamId)).toEqual(false);
  });
});
describe('getTeamsList', () => {
  test('should return a list of teams', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    expect(await adapter.getTeamsList(username)).toEqual(defaultTeamsListMock);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockRejectedValueOnce(new FileNotFoundError());
    await expect(adapter.getTeamsList(username)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('getTeam', () => {
  test('should return a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock)
      .mockResolvedValueOnce(nonDefaultTeamMock)
      .mockResolvedValueOnce(nonDefaultTeamsListMock);
    const result = await adapter.getTeam(username, teamId);
    expect(result).toEqual(nonDefaultTeamMock);
  });
  test('should return a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockResolvedValueOnce(defaultTeamMock)
      .mockResolvedValueOnce(defaultTeamsListMock);
    await expect(adapter.getTeam(username, teamId)).resolves.toEqual(
      defaultTeamMock,
    );
  });

  test('should handle errors', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockImplementationOnce(() => {
        throw new FileNotFoundError();
      });
    await expect(adapter.getTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockResolvedValueOnce(defaultTeamMock)
      .mockImplementationOnce(() => {
        throw new FileNotFoundError();
      });
    await expect(adapter.getTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('copyTeamListTeam', () => {
  test('should copy a team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(cloneObject(nonDefaultTeamsListMock))
      .mockResolvedValueOnce(defaultTeamsListMock);

    const expectedTeamsList = cloneObject(nonDefaultTeamsListMock);
    expectedTeamsList[teamId] = cloneObject(defaultTeamsListMock[teamId]);

    await adapter.copyTeamListTeam(defaultUsername, username, teamId);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(1);
    expect(JSON.parse(dataStorageMock.writeFile.mock.calls[0][1])).toEqual(
      expectedTeamsList,
    );
  });
  test('should handle same source and target users', async () => {
    await expect(
      adapter.copyTeamListTeam(defaultUsername, defaultUsername, teamId),
    ).rejects.toThrow('Source and target users must be different');
  });
});
describe('copyTeamsList', () => {
  test('should copy a list of teams', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    await adapter.copyTeamsList(defaultUsername, username);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamsListMock),
    );
  });
  test('should handle same source and target users situation', async () => {
    await expect(
      adapter.copyTeamsList(defaultUsername, defaultUsername),
    ).rejects.toThrow('Source and target users must be different');
  });
});
describe('cloneTeamFromDefault', () => {
  test('should clone a team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamMock);
    await adapter.cloneTeamFromDefault(username, teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamMock),
    );
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.cloneTeamFromDefault(username, teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('updateTeam', () => {
  test('should update a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock) //isTeamDefault
      .mockResolvedValueOnce(defaultTeamMock) //cloneTeamFromDefault
      .mockResolvedValueOnce(defaultTeamsListMock) //updateTeamListTeam (ensureTeamIsUnDefault)
      .mockResolvedValueOnce(defaultTeamsListMock) //updateTeamListParameter
      .mockResolvedValueOnce(defaultTeamMock); //readTeamFile

    const expectedDefaultTeamsList = cloneObject(defaultTeamsListMock);
    expectedDefaultTeamsList[teamId] = cloneObject({
      ...defaultTeamsListMock[teamId],
      isDefault: false,
      lastUpdated: lastUpdated,
    });

    const expectedDefaultTeam: TeamExtended = cloneObject({
      ...defaultTeamMock,
      ...newNameProp,
      lastUpdated: lastUpdated,
    });

    await adapter.updateTeam(newNameProp, username, teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(4);

    const writeFileContents = dataStorageMock.writeFile.mock.calls.map(
      ([, serializedContent]) => {
        return JSON.parse(serializedContent);
      },
    );

    expect(writeFileContents[0]).toEqual(defaultTeamMock);
    expect(writeFileContents[1]).toEqual(expectedDefaultTeamsList);
    expect(writeFileContents[2]).toEqual(defaultTeamsListMock);
    expect(writeFileContents[3]).toEqual(expectedDefaultTeam);
  });
  test('should update a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock) //isTeamDefault
      .mockResolvedValueOnce(nonDefaultTeamsListMock) //updateTeamListParameter
      .mockResolvedValueOnce(nonDefaultTeamMock); //readTeamFile

    const modifiedTeam: TeamExtended = cloneObject(nonDefaultTeamMock);
    Object.assign(modifiedTeam, newNameProp);
    delete modifiedTeam.lastUpdated;

    const modifiedTeamsList: TeamListTeam[] = cloneObject(nonDefaultTeamsListMock);
    Object.assign(modifiedTeamsList[teamId], newNameProp);
    delete modifiedTeamsList[teamId].lastUpdated;

    await adapter.updateTeam(newNameProp, username, teamId);

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(2);

    const [, serializedTeamsList] = dataStorageMock.writeFile.mock.calls[0];
    const [, serializedTeam] = dataStorageMock.writeFile.mock.calls[1];

    const actualTeamsList = JSON.parse(serializedTeamsList) as TeamListTeam[];
    const actualTeam = JSON.parse(serializedTeam) as TeamExtended;

    delete actualTeamsList[teamId].lastUpdated;
    delete actualTeam.lastUpdated;

    expect(actualTeamsList[teamId]).toEqual(modifiedTeamsList[teamId]);
    expect(actualTeam).toEqual(modifiedTeam);
  });
  test('should handle null data', async () => {
    await expect(adapter.updateTeam(null, username, teamId)).rejects.toThrow(
      Error('No data provided'),
    );
  });
  test('should handle errors on isTeamDefault', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.updateTeam(newNameProp, username, teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
  test('should handle errors on updateTeamlistTeam', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock)
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(
      adapter.updateTeam(newNameProp, username, teamId),
    ).rejects.toThrow(Error);
  });
  test('should handle errors on saveTeam', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock)
      .mockResolvedValueOnce(nonDefaultTeamsListMock)
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(
      adapter.updateTeam(newNameProp, username, teamId),
    ).rejects.toThrow(Error);
  });
});
describe('validateTeam', () => {
  test('should validate a default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    const result = await adapter.validateTeam(username, teamId);
    expect(result).toEqual(defaultTeamsListMock[teamId]);
  });
  test('should validate a non-default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(nonDefaultTeamsListMock);
    const result = await adapter.validateTeam(username, teamId);
    expect(result).toEqual(nonDefaultTeamsListMock[teamId]);
  });
  test('should fail to validate a default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    const UNEXPECTED_TEAM_ID = -1;
    const result = await adapter.validateTeam(username, UNEXPECTED_TEAM_ID);
    expect(result).toEqual(false);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(adapter.validateTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('deleteTeam', () => {
  test('should delete a team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(nonDefaultTeamsListMock);

    const clonedTeamsList = JSON.parse(
      JSON.stringify(nonDefaultTeamsListMock),
    ) as TeamListTeam[];
    delete clonedTeamsList[teamId];

    await adapter.deleteTeam(username, teamId);
    expect(dataStorageMock.deleteFile).toHaveBeenCalledWith(filePath);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(clonedTeamsList),
    );
  });
  it('should delete a team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(nonDefaultTeamsListMock);

    const expectedTeamsList = JSON.parse(
      JSON.stringify(nonDefaultTeamsListMock),
    ) as TeamListTeam[];
    delete expectedTeamsList[teamId];

    await adapter.deleteTeam(username, teamId);
    expect(dataStorageMock.deleteFile).toHaveBeenCalledWith(filePath);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(expectedTeamsList),
    );
  });
    dataStorageMock.readJSONFile.mockRejectedValueOnce(() => {
  test('should handle errors', async () => {
      throw new FileNotFoundError();
    });
    await expect(adapter.deleteTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
