import TeamStorageAdapter, { getDate } from '../teamStorage.adapter';
jest.mock('../../storage/dataStorage');
jest.mock('../../storage/userPath');
import * as ds from '../../storage/dataStorage';
import * as us from '../../storage/userPath';
import FileNotFoundError from '../../errors/FileNotFoundError';
import TeamExtended from '../../models/TeamExtended';
import TeamListTeam from '../../models/TeamListTeam';
import Player from '../../models/Player';
import mockUtils from './mockUtils';
import NoDataProvidedError from '../../errors/NoDataProvidedError';
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
  test('should handle empty data', async () => {
    await expect(
      adapter.updateTeam(null, mock.username, mock.teamId),
    ).rejects.toThrow(NoDataProvidedError);
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
  test('should add a player to a non-empty default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getDefaultTeam()) //cloneTeamFromDefault
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //updateTeamListTeam (ensureTeamIsUnDefault)
      .mockResolvedValueOnce(mock.getDefaultTeam()); //readTeamFile

    const modifiedTeam: TeamExtended = mock.getDefaultTeam();

    await adapter.addPlayer(
      mock.username,
      mock.teamId,
      mock.getNewPlayer(modifiedTeam.squad),
    );
    modifiedTeam.squad.unshift(mock.getNewPlayer(modifiedTeam.squad));
    modifiedTeam.lastUpdated = getDate();

    const actualTeam = JSON.parse(dataStorageMock.writeFile.mock.calls[2][1]);

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(3);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(4);
    expect(actualTeam).toEqual(modifiedTeam);
  });
  test('should add a player to a non-empty non-default team', async () => {
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
    await adapter.addPlayer(mock.username, mock.teamId, newPlayer);

    modifiedTeam.squad.unshift(newPlayer);
    modifiedTeam.lastUpdated = getDate();

    const actualTeam = JSON.parse(dataStorageMock.writeFile.mock.calls[0][1]);

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(1);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
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
    modifiedTeam.lastUpdated = getDate();

    await adapter.addPlayer(mock.username, mock.teamId, newPlayer);
    const actualTeam = JSON.parse(dataStorageMock.writeFile.mock.calls[0][1]);

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(1);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
    expect(actualTeam).toEqual(modifiedTeam);
  });
  test('should handle empty data', async () => {
    await expect(
      adapter.addPlayer(mock.username, mock.teamId, {} as Player),
    ).rejects.toThrow(NoDataProvidedError);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.addPlayer(mock.username, mock.teamId, mock.getNewPlayer([])),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('updatePlayer', () => {
  test('should update a player from a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getDefaultTeam()) //cloneTeamFromDefault
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //updateTeamListTeam (ensureTeamIsUnDefault)
      .mockResolvedValueOnce(mock.getDefaultTeam()); //readTeamFile

    const modifiedTeamsList = {
      ...mock.getDefaultTeamsList(),
      [mock.teamId]: {
        ...mock.getDefaultTeamsList()[mock.teamId],
        isDefault: false,
      },
    };

    const modifiedTeam: TeamExtended = {
      ...mock.getDefaultTeam(),
      squad: [
        {
          ...mock.getDefaultTeam().squad[0],
          ...mock.newNameProp,
        },
      ],
      lastUpdated: getDate(),
    };
    const modifiedPlayer: Player = {
      ...mock.getDefaultTeam().squad[0],
      ...mock.newNameProp,
    };

    await adapter.updatePlayer(mock.username, mock.teamId, modifiedPlayer);

    const writeFileContents = dataStorageMock.writeFile.mock.calls.map(
      ([, serializedContent]) => {
        return JSON.parse(serializedContent);
      },
    );

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(3);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(4);
    expect(writeFileContents[0]).toEqual(mock.getDefaultTeam());
    expect(writeFileContents[1]).toEqual(modifiedTeamsList);
    expect(writeFileContents[2]).toEqual(modifiedTeam);
  });
  test('should update a player from a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getNonDefaultTeam()); //readTeamFile

    const modifiedTeam: TeamExtended = {
      ...mock.getNonDefaultTeam(),
      squad: [
        {
          ...mock.getNonDefaultTeam().squad[0],
          ...mock.newNameProp,
        },
      ],
      lastUpdated: getDate(),
    };
    const modifiedPlayer: Player = {
      ...mock.getNonDefaultTeam().squad[0],
      ...mock.newNameProp,
    };

    await adapter.updatePlayer(mock.username, mock.teamId, modifiedPlayer);

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(1);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
    expect(JSON.parse(dataStorageMock.writeFile.mock.calls[0][1])).toEqual(
      modifiedTeam,
    );
  });
  test('should handle non-defualt team non-existent player update', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getNonDefaultTeam()); //readTeamFile

    const modifiedPlayer: Player = {
      ...mock.getNonDefaultTeam().squad[0],
      id: 9999999999,
    };

    await expect(
      adapter.updatePlayer(mock.username, mock.teamId, modifiedPlayer),
    ).rejects.toThrow(Error('Player not found'));

    expect(dataStorageMock.writeFile).not.toHaveBeenCalled();
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
  });
  test('should handle empty data', async () => {
    await expect(
      adapter.updatePlayer(mock.username, mock.teamId, {} as Player),
    ).rejects.toThrow(NoDataProvidedError);
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    }); //isTeamDefault

    const modifiedPlayer: Player = {
      ...mock.getNonDefaultTeam().squad[0],
    };

    await expect(
      adapter.updatePlayer(mock.username, mock.teamId, modifiedPlayer),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('removePlayer', () => {
  test('should remove a player from a default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getDefaultTeam()) //cloneTeamFromDefault
      .mockResolvedValueOnce(mock.getDefaultTeamsList()) //updateTeamListTeam (ensureTeamIsUnDefault)
      .mockResolvedValueOnce(mock.getDefaultTeam()); //readTeamFile

    const modifiedTeamsList = {
      ...mock.getDefaultTeamsList(),
      [mock.teamId]: {
        ...mock.getDefaultTeamsList()[mock.teamId],
        isDefault: false,
      },
    };

    const modifiedTeam: TeamExtended = {
      ...mock.getDefaultTeam(),
      lastUpdated: getDate(),
    };
    delete modifiedTeam.squad[
      modifiedTeam.squad.findIndex((player) => player.id === mock.playerId)
    ];

    await adapter.removePlayer(mock.username, mock.teamId, mock.playerId);

    const writeFileContents = dataStorageMock.writeFile.mock.calls.map(
      ([, serializedContent]) => {
        return JSON.parse(serializedContent);
      },
    );

    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(4);
    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(3);
    expect(writeFileContents[0]).toEqual(mock.getDefaultTeam());
    expect(writeFileContents[1]).toEqual(modifiedTeamsList);
    expect(writeFileContents[2]).toEqual(modifiedTeam);
  });
  test('should remove a player from a non-default team', async () => {
    dataStorageMock.readJSONFile
      .mockResolvedValueOnce(mock.getNonDefaultTeamsList()) //isTeamDefault
      .mockResolvedValueOnce(mock.getNonDefaultTeam()); //readTeamFile

    const modifiedTeam: TeamExtended = {
      ...mock.getNonDefaultTeam(),
      lastUpdated: getDate(),
    };
    delete modifiedTeam.squad[
      modifiedTeam.squad.findIndex((player) => player.id === mock.playerId)
    ];

    await adapter.removePlayer(mock.username, mock.teamId, mock.playerId);

    expect(dataStorageMock.writeFile).toHaveBeenCalledTimes(1);
    expect(dataStorageMock.readJSONFile).toHaveBeenCalledTimes(2);
    expect(JSON.parse(dataStorageMock.writeFile.mock.calls[0][1])).toEqual(
      modifiedTeam,
    );
  });
  test('should handle errors', async () => {
    dataStorageMock.readJSONFile.mockImplementationOnce(() => {
      throw new FileNotFoundError();
    });
    await expect(
      adapter.removePlayer(mock.username, mock.teamId, mock.playerId),
    ).rejects.toThrow(FileNotFoundError);
  });
});
describe('findNextFreeTeamId', () => {
  test('should find the next free team id on an empty list', async () => {
    expect(adapter.findNextFreeTeamId([])).toEqual(0);
  });
  test('should find the next free team id on a non-empty list', async () => {
    const teamsList = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 4 }, //Missing id: 3, but should be added as a new team
    ] as TeamListTeam[];
    expect(adapter.findNextFreeTeamId(teamsList)).toEqual(3);
  });
  test('should find 0 as the next free team id on a non-empty list', async () => {
    const teamsList = [{ id: 2 }] as TeamListTeam[];
    expect(adapter.findNextFreeTeamId(teamsList)).toEqual(0);
  });
});
describe('findNextFreePlayerId', () => {
  test('should find the next free player id on an empty list', async () => {
    expect(adapter.findNextFreePlayerId([])).toEqual(0);
  });
  test('should find the next free player id on a non-empty list', async () => {
    const squad = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 4 }, //Missing id: 3, but should be added as a new player
    ] as Player[];
    expect(adapter.findNextFreePlayerId(squad)).toEqual(3);
  });
  test('should find 0 as the next free player id on a non-empty list', async () => {
    const squad = [{ id: 2 }] as Player[];
    expect(adapter.findNextFreePlayerId(squad)).toEqual(0);
  });
});
