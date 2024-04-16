import TeamStorageAdapter, { getDate } from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
jest.mock('../../storage/userPath');
import * as ds from '../../storage/dataStorage';
import * as us from '../../storage/userPath';
import FileNotFoundError from '../../errors/FileNotFoundError';
import TeamExtended from '../../models/TeamExtended';
import TeamListTeam from 'src/components/models/TeamListTeam';
import Player from '../../models/Player';
import mockUtils from './mockUtils';
jest.spyOn(console, 'log').getMockImplementation();

const dataStorageMock = ds as jest.Mocked<typeof ds>;
const userPathMock = us as jest.Mocked<typeof us>;
const adapter = new TeamStorageAdapter();
const mock = new mockUtils();
jest.useFakeTimers().setSystemTime(mock.lastUpdated);

beforeEach(() => {
  jest.resetAllMocks();
  userPathMock.getUserTeamsListJSONPath.mockReturnValue(mock.filePath);
  userPathMock.getUserTeamJSONPath.mockReturnValue(mock.filePath);
  dataStorageMock.writeFile.mockResolvedValue(undefined as never);
});
describe('isTeamDefault', () => {
  test('should return true when team is default', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(mock.getDefaultTeamsList());

    expect(await adapter.isTeamDefault(mock.username, mock.teamId)).toEqual(
      true,
    );
  });
  test('should return false when team is not default', async () => {
    dataStorageMock.readJSONFile.mockResolvedValue(
      mock.getNonDefaultTeamsList(),
    );
    expect(await adapter.isTeamDefault(mock.username, mock.teamId)).toEqual(
      false,
    );
  });
});
describe('getTeamsList', () => {
  test('should return a list of teams', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(
      mock.getDefaultTeamsList(),
    );
    expect(await adapter.getTeamsList(mock.username)).toEqual(
      mock.getDefaultTeamsList(),
    );
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockRejectedValueOnce(new FileNotFoundError());
    await expect(adapter.getTeamsList(mock.username)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('getTeam', () => {
  test('should return a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList())
      .mockResolvedValueOnce(mock.getNonDefaultTeam())
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList());
    const result = await adapter.getTeam(mock.username, mock.teamId);
    expect(result).toEqual(mock.getNonDefaultTeam());
  });
  test('should return a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList())
      .mockResolvedValueOnce(mock.getDefaultTeam())
      .mockResolvedValueOnce(mock.getDefaultTeamsList());
    await expect(adapter.getTeam(mock.username, mock.teamId)).resolves.toEqual(
      mock.getDefaultTeam(),
    );
  });

  test('should handle errors', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList())
      .mockImplementationOnce(() => {
        throw new FileNotFoundError();
      });
    await expect(adapter.getTeam(mock.username, mock.teamId)).rejects.toThrow(
      FileNotFoundError,
    );
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList())
      .mockResolvedValueOnce(mock.getDefaultTeam())
      .mockImplementationOnce(() => {
        throw new FileNotFoundError();
      });
    await expect(adapter.getTeam(mock.username, mock.teamId)).rejects.toThrow(
      FileNotFoundError,
    );
  });
});
describe('copyTeamListTeam', () => {
  test('should copy a team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList())
      .mockResolvedValueOnce(mock.getDefaultTeamsList());

    const expectedTeamsList = mock.getNonDefaultTeamsList();
    expectedTeamsList[mock.teamId] = mock.getDefaultTeamsList()[mock.teamId];

    await adapter.copyTeamListTeam(
      mock.defaultUsername,
      mock.username,
      mock.teamId,
    );
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(1);
    expect(JSON.parse(dataStorageMock.writeFile.mock.calls[0][1])).toEqual(
      expectedTeamsList,
    );
  });
  test('should handle same source and target users', async () => {
    await expect(
      adapter.copyTeamListTeam(
        mock.defaultUsername,
        mock.defaultUsername,
        mock.teamId,
      ),
    ).rejects.toThrow('Source and target users must be different');
  });
});
describe('copyTeamsList', () => {
  test('should copy a list of teams', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(
      mock.getDefaultTeamsList(),
    );
    await adapter.copyTeamsList(mock.defaultUsername, mock.username);
    expect(JSON.parse(dataStorageMock.writeFile.mock.calls[0][1])).toEqual(
      mock.getDefaultTeamsList(),
    );
  });
  test('should handle same source and target users situation', async () => {
    await expect(
      adapter.copyTeamsList(mock.defaultUsername, mock.defaultUsername),
    ).rejects.toThrow('Source and target users must be different');
  });
});
describe('cloneTeamFromDefault', () => {
  test('should clone a team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(mock.getDefaultTeam());
    await adapter.cloneTeamFromDefault(mock.username, mock.teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledWith(
      mock.filePath,
      JSON.stringify(mock.getDefaultTeam()),
    );
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.cloneTeamFromDefault(mock.username, mock.teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('updateTeam', () => {
  test('should update a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getDefaultTeam()) //cloneTeamFromDefault
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //updateTeamListTeam (ensureTeamIsUnDefault)
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //updateTeamListParameter
      .mockResolvedValueOnce(mock.getDefaultTeam()); //readTeamFile

    const expectedDefaultTeamsList = mock.getDefaultTeamsList();
    expectedDefaultTeamsList[mock.teamId] = {
      ...mock.getDefaultTeamsList()[mock.teamId],
      isDefault: false,
      lastUpdated: getDate(),
    };

    const expectedModifiedTeamsList = mock.getDefaultTeamsList();
    expectedModifiedTeamsList[mock.teamId] = {
      ...mock.getDefaultTeamsList()[mock.teamId],
      ...mock.newNameProp,
      lastUpdated: getDate(),
    };

    const expectedDefaultTeam: TeamExtended = {
      ...mock.getDefaultTeam(),
      ...mock.newNameProp,
      lastUpdated: getDate(),
    };

    await adapter.updateTeam(mock.newNameProp, mock.username, mock.teamId);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(4);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(5);

    const writeFileContents = dataStorageMock.writeFile.mock.calls.map(
      ([, serializedContent]) => {
        return JSON.parse(serializedContent);
      },
    );

    expect(writeFileContents[0]).toEqual(mock.getDefaultTeam());
    expect(writeFileContents[1]).toEqual(expectedDefaultTeamsList);
    expect(writeFileContents[2]).toEqual(expectedModifiedTeamsList);
    expect(writeFileContents[3]).toEqual(expectedDefaultTeam);
  });
  test('should update a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //updateTeamListParameter
      .mockResolvedValueOnce(mock.getNonDefaultTeam()); //readTeamFile

    const modifiedTeamsList: TeamListTeam[] = {
      ...mock.getNonDefaultTeamsList(),
      [mock.teamId]: {
        ...mock.getNonDefaultTeamsList()[mock.teamId],
        ...mock.newNameProp,
        lastUpdated: getDate(),
      },
    };
    const modifiedTeam: TeamExtended = {
      ...mock.getNonDefaultTeam(),
      ...mock.newNameProp,
      lastUpdated: getDate(),
    };

    await adapter.updateTeam(mock.newNameProp, mock.username, mock.teamId);

    const writeFileContents = dataStorageMock.writeFile.mock.calls.map(
      ([, serializedContent]) => {
        return JSON.parse(serializedContent);
      },
    );
    expect(writeFileContents[0][mock.teamId]).toEqual(
      modifiedTeamsList[mock.teamId],
    );
    expect(writeFileContents[1]).toEqual(modifiedTeam);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(2);
  });
  test('should handle null data', async () => {
    await expect(
      adapter.updateTeam(null, mock.username, mock.teamId),
    ).rejects.toThrow(Error('No data provided'));
  });
  test('should handle errors on isTeamDefault', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.updateTeam(mock.newNameProp, mock.username, mock.teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
  test('should handle errors on updateTeamlistTeam', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList())
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(
      adapter.updateTeam(mock.newNameProp, mock.username, mock.teamId),
    ).rejects.toThrow(Error);
  });
  test('should handle errors on saveTeam', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList())
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList())
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(
      adapter.updateTeam(mock.newNameProp, mock.username, mock.teamId),
    ).rejects.toThrow(Error);
  });
});
describe('validateTeam', () => {
  test('should validate a default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(
      mock.getDefaultTeamsList(),
    );
    const result = await adapter.validateTeam(mock.username, mock.teamId);
    expect(result).toEqual(mock.getDefaultTeamsList()[mock.teamId]);
  });
  test('should validate a non-default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(
      mock.getNonDefaultTeamsList(),
    );
    const result = await adapter.validateTeam(mock.username, mock.teamId);
    expect(result).toEqual(mock.getNonDefaultTeamsList()[mock.teamId]);
  });
  test('should fail to validate a default team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(
      mock.getDefaultTeamsList(),
    );
    const UNEXPECTED_TEAM_ID = -1;
    const result = await adapter.validateTeam(
      mock.username,
      UNEXPECTED_TEAM_ID,
    );
    expect(result).toEqual(false);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.validateTeam(mock.username, mock.teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('deleteTeam', () => {
  test('should delete a team', async () => {
    dataStorageMock.readJSONFile.mockResolvedValueOnce(
      mock.getNonDefaultTeamsList(),
    );

    const clonedTeamsList: TeamListTeam[] = mock.getNonDefaultTeamsList();
    delete clonedTeamsList[mock.teamId];

    await adapter.deleteTeam(mock.username, mock.teamId);
    expect(dataStorageMock.deleteFile).toHaveBeenCalledWith(mock.filePath);
    const actualTeamsList = JSON.parse(
      dataStorageMock.writeFile.mock.calls[0][1],
    );
    expect(actualTeamsList).toEqual(clonedTeamsList);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.deleteTeam(mock.username, mock.teamId),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('addPlayer', () => {
  test('should add a player to a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getNonDefaultTeam()); //readTeamFile

    const modifiedTeam: TeamExtended = mock.getNonDefaultTeam();
    const newPlayer = {
      id: adapter.findNextFreePlayerId(modifiedTeam.squad), //This is to ensure it isn't stored with an invalid id
      name: 'newname',
      position: 'newposition',
      dateOfBirth: 'newdateOfBirth',
      countryOfBirth: 'newcountryOfBirth',
      nationality: 'newnationality',
      role: 'newrole',
    } as Player;
    modifiedTeam.squad.unshift(newPlayer);
    await adapter.addPlayer(mock.username, mock.teamId, newPlayer);
    const actualTeam = JSON.parse(dataStorageMock.writeFile.mock.calls[0][1]);
    expect(actualTeam).toEqual(modifiedTeam);
  });
  test('should add a player to an empty non-default team', async () => {
    const modifiedTeam: TeamExtended = {
      ...mock.getNonDefaultTeam(),
      squad: [],
    };
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.cloneObject(modifiedTeam)); //readTeamFile
    const newPlayer = mock.getNewPlayer(modifiedTeam.squad);
    modifiedTeam.squad.push(newPlayer);

    await adapter.addPlayer(mock.username, mock.teamId, newPlayer);
    const actualTeam = JSON.parse(dataStorageMock.writeFile.mock.calls[0][1]);
    expect(actualTeam).toEqual(modifiedTeam);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.addPlayer(mock.username, mock.teamId, {} as Player),
    ).rejects.toThrow(FileNotFoundError);
  });
});
