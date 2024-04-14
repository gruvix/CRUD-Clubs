import TeamStorageAdapter from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
jest.mock('../../storage/userPath');
import * as ds from '../../storage/dataStorage';
import * as us from '../../storage/userPath';
import FileNotFoundError from '../../errors/FileNotFoundError';
import TeamExtended from '../../models/TeamExtended';
import TeamListTeam from 'src/components/models/TeamListTeam';
jest.spyOn(console, 'log').getMockImplementation();

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
  hasDefault: false,
  isDefault: false,
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
  hasDefault: true,
  isDefault: true,
  lastUpdated: '2024-04-11T21:47:40.430Z',
});
function cloneObject<T>(obj: T): any {
  return JSON.parse(JSON.stringify(obj)) as T;
}
beforeAll(() => {
  userPathMock.getUserTeamsListJSONPath.mockReturnValue(filePath);
  userPathMock.getUserTeamJSONPath.mockReturnValue(filePath);
  dataStorageMock.writeFile.mockResolvedValue(undefined as never);
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
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    expect(await adapter.getTeamsList(username)).toEqual(defaultTeamsListMock);
  });
  it('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockRejectedValueOnce(new FileNotFoundError());
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
    await expect(adapter.getTeam(username, teamId)).resolves.toEqual(
      defaultTeamMock,
    );
  });

  it('should handle errors', async () => {
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
  it('should copy a team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock)
      .mockResolvedValueOnce(nonDefaultTeamsListMock);
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
    await adapter.copyTeamsList(defaultUsername, username);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamsListMock),
    );
  });
  it('should handle same source and target users situation', async () => {
    await expect(
      adapter.copyTeamsList(defaultUsername, defaultUsername),
    ).rejects.toThrow('Source and target users must be different');
  });
});
describe('cloneTeamFromDefault', () => {
  it('should clone a team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamMock);
    await adapter.cloneTeamFromDefault(username, teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamMock),
    );
  });
  it('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.cloneTeamFromDefault(username, teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('updateTeam', () => {
  it('should update a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(defaultTeamsListMock) //isTeamDefault
      .mockResolvedValueOnce(defaultTeamMock) //cloneTeamFromDefault
      .mockResolvedValueOnce(defaultTeamsListMock) //updateTeamListTeam (ensureTeamIsUnDefault)
      .mockResolvedValueOnce(defaultTeamsListMock) //updateTeamListParameter
      .mockResolvedValueOnce(nonDefaultTeamMock); //readTeamFile

    const clonedDefaultTeamsList = JSON.parse(
      JSON.stringify(defaultTeamsListMock),
    ) as TeamListTeam[];
    clonedDefaultTeamsList[teamId].isDefault = false;

    await adapter.updateTeam(newNameProp, username, teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(4);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamMock),
    );
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(clonedDefaultTeamsList),
    );
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamsListMock),
    );
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      filePath,
      JSON.stringify(defaultTeamMock),
    );
  });
  it('should update a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock) //isTeamDefault
      .mockResolvedValueOnce(nonDefaultTeamsListMock) //updateTeamListParameter
      .mockResolvedValueOnce(nonDefaultTeamMock); //readTeamFile
    const modifiedTeam = JSON.parse(
      JSON.stringify(nonDefaultTeamMock),
    ) as TeamExtended;
    Object.assign(modifiedTeam, newNameProp);
    delete modifiedTeam.lastUpdated;

    const modifiedTeamsList = JSON.parse(
      JSON.stringify(nonDefaultTeamsListMock),
    ) as TeamListTeam[];
    Object.assign(modifiedTeamsList[teamId], newNameProp);
    delete modifiedTeamsList[teamId].lastUpdated;

    await adapter.updateTeam(newNameProp, username, teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(2);

    const [, serializedTeamsList] = dataStorageMock.writeFile.mock.calls[0];
    const [, serializedTeam] = dataStorageMock.writeFile.mock.calls[1];

    const actualTeamsList = JSON.parse(serializedTeamsList) as TeamListTeam[];
    const actualTeam = JSON.parse(serializedTeam) as TeamExtended;

    delete actualTeam.lastUpdated;
    expect(actualTeam).toEqual(modifiedTeam);
    delete actualTeamsList[teamId].lastUpdated;
    expect(actualTeamsList[teamId]).toEqual(modifiedTeamsList[teamId]);
  });
  it('should handle null data', async () => {
    await expect(adapter.updateTeam(null, username, teamId)).rejects.toThrow(
      Error('No data provided'),
    );
  });
  it('should handle errors on isTeamDefault', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.updateTeam(newNameProp, username, teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
  it('should handle errors on updateTeamlistTeam', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(nonDefaultTeamsListMock)
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(
      adapter.updateTeam(newNameProp, username, teamId),
    ).rejects.toThrow(Error);
  });
  it('should handle errors on saveTeam', async () => {
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
  it('should validate a default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    const result = await adapter.validateTeam(username, teamId);
    expect(result).toEqual(defaultTeamsListMock[teamId]);
  });
  it('should validate a non-default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(nonDefaultTeamsListMock);
    const result = await adapter.validateTeam(username, teamId);
    expect(result).toEqual(nonDefaultTeamsListMock[teamId]);
  });
  it('should fail to validate a default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(defaultTeamsListMock);
    const UNEXPECTED_TEAM_ID = -1;
    const result = await adapter.validateTeam(username, UNEXPECTED_TEAM_ID);
    expect(result).toEqual(false);
  });
  it('should fail to validate a default team', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(adapter.validateTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('deleteTeam', () => {
  it('should delete a team', async () => {
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
  it('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockRejectedValueOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(adapter.deleteTeam(username, teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
