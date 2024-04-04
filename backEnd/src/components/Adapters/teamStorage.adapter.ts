import TeamListTeam from '../models/TeamListTeam';
import Player from '../models/Player';
import TeamExtended from '../models/TeamExtended';
import {
  generateCustomCrestUrl,
  getUserTeamJSONPath,
  getUserTeamsListJSONPath,
} from '../storage/userPath';
import { readJSONFile, writeFile, deleteFile } from '../storage/dataStorage';

/**
 * gets a team from storage by id and username
 * @param {string} username
 * @param {Number} teamId
 */
async function readTeamFile(
  username: string,
  teamId: number | string,
): Promise<TeamExtended> {
  try {
    const teamPath = getUserTeamJSONPath(username, teamId);
    const team = new TeamExtended(await readJSONFile(teamPath));
    return team;
  } catch (error) {
    throw error;
  }
}
function saveTeam(team: TeamExtended, username: string) {
  try {
    const targetPath = getUserTeamJSONPath(username, team.id);
    console.log(`Saving team ${team.id} to ${username} on ${targetPath}`);
    const content = JSON.stringify(team);
    writeFile(targetPath, content);
  } catch (writeError) {
    throw writeError;
  }
}
/**
 * updates a teamlist parameter
 * @param {string} username
 * @param {Number} teamId
 * @param {string} parameter - teamlist parameter to be updated
 * @param {any} value - new value of parameter
 */
function updateTeamlistParameter(
  username: string,
  teamId: number | string,
  parameter: string,
  value: string | number | boolean,
) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teams = readJSONFile(teamsPath);
  teams[teamId][parameter] = value;
  writeFile(teamsPath, JSON.stringify(teams));
}
function addTeamToTeamlist(newTeam: TeamExtended, username: string) {
  const userTeamsPath = getUserTeamsListJSONPath(username);
  const userTeams = readJSONFile(userTeamsPath);
  userTeams[newTeam.id] = new TeamListTeam(
    newTeam as unknown as TeamListTeam,
    true,
    false,
    false,
  );
  writeFile(userTeamsPath, JSON.stringify(userTeams));
}
function deleteTeamFromTeamlist(username: string, teamId: number | string) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teams = readJSONFile(teamsPath);
  delete teams[teamId];
  writeFile(teamsPath, JSON.stringify(teams));
}
/**
 * @returns {string} - Returns current date in ISOS string format
 */
function getDate(): string {
  const now = new Date();
  return now.toISOString();
}
function findNextFreePlayerId(players: Player[]): number {
  const sortedPlayers = [...players].sort(
    (a: Player, b: Player) => a.id - b.id,
  );

  let nextFreeId = 0;

  for (let index = 0; index < sortedPlayers.length; index += 1) {
    if (sortedPlayers[index].id > nextFreeId) {
      return nextFreeId;
    }
    nextFreeId = sortedPlayers[index].id + 1;
    console.log(`Next free ID: ${nextFreeId}`);
  }
  return nextFreeId;
}
function hasTeamDefault(username: string, teamId: number | string) {
  const teamsListPath = getUserTeamsListJSONPath(username);
  const teams = readJSONFile(teamsListPath);
  const team = teams[teamId];
  return team.hasDefault;
}
export default class TeamStorageAdapter {
  private async defaultTeamCheck(
    username: string,
    teamId: number | string,
  ): Promise<void> {
    try {
      if (this.isTeamDefault(username, teamId)) {
        await this.cloneTeamFromDefault(username, teamId);
        const DEFAULT_TEAMLIST_PARAMETER = 'isDefault';
        updateTeamlistParameter(
          username,
          teamId,
          DEFAULT_TEAMLIST_PARAMETER,
          false,
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async isTeamDefault(
    username: string,
    teamId: number | string,
  ): Promise<boolean> {
    const teamsListPath = getUserTeamsListJSONPath(username);
    const teams = await readJSONFile(teamsListPath);
    const team = teams[teamId];
    if (team.isDefault) {
      return true;
    }
    return false;
  }
  /**
   * gets a teams list by username
   * @param {string} username
   */
  getTeamsList(username: string) {
    return readJSONFile(getUserTeamsListJSONPath(username));
  }
  async getTeam(
    username: string,
    teamId: number | string,
  ): Promise<TeamExtended> {
    const teamDefaultBool = await this.isTeamDefault(username, teamId);
    try {
      let sourceUserName = 'default';
      !teamDefaultBool ? (sourceUserName = username) : null;
      const team = new TeamExtended({
        ...(await readTeamFile(sourceUserName, teamId)),
        isDefault: teamDefaultBool,
        hasDefault: hasTeamDefault(username, teamId),
      });
      return team;
    } catch (error) {
      throw error;
    }
  }
  async copyTeamListTeam(
    sourceUser: string,
    targetUser: string,
    teamId: string | number,
  ): Promise<void> {
    const sourceTeamsPath = getUserTeamsListJSONPath(sourceUser);
    const targetTeamsPath = getUserTeamsListJSONPath(targetUser);
    const userTeams = readJSONFile(targetTeamsPath);
    const defaultTeams: TeamListTeam[] = await readJSONFile(sourceTeamsPath);

    const newTeam: TeamListTeam = Object.values(defaultTeams).find(
      (team: TeamListTeam) => team.id === Number(teamId),
    ) as TeamListTeam;
    try {
      userTeams[teamId] = new TeamListTeam(newTeam);
      writeFile(targetTeamsPath, JSON.stringify(userTeams));
    } catch (copyError) {
      throw copyError;
    }
  }
  async copyTeamList(sourceUser: string, targetUser: string): Promise<void> {
    const defaultTeamsPath = getUserTeamsListJSONPath(sourceUser);
    const teams = await readJSONFile(defaultTeamsPath);
    const teamsParsed: { [key: string]: TeamListTeam } = {};
    teams.forEach((team: TeamListTeam) => {
      teamsParsed[team.id] = new TeamListTeam(team);
    });
    try {
      const teamsPath = getUserTeamsListJSONPath(targetUser);
      writeFile(teamsPath, JSON.stringify(teamsParsed));
    } catch (creationError) {
      throw creationError;
    }
  }
  /**
   * @param {string} targetUser - username of copy target folder
   * @param {Number} teamId - id of the team to be copied
   */
  async cloneTeamFromDefault(targetUser: string, teamId: number | string) {
    try {
      const DEFAULT_USER = 'default';
      const team = await readTeamFile(DEFAULT_USER, teamId);
      saveTeam(team, targetUser);
    } catch (copyError) {
      throw copyError;
    }
  }
  async updateTeam(
    newData: { [key: string]: string | number | boolean },
    username: string,
    teamId: number | string,
  ): Promise<void> {
    const updatedData = newData;
    this.defaultTeamCheck(username, teamId);
    updatedData.lastUpdated = getDate();
    TeamListTeam.properties().forEach((key: string) => {
      if (updatedData[key] !== undefined) {
        updateTeamlistParameter(username, teamId, key, updatedData[key]);
      }
    });
    const team = await readTeamFile(username, teamId);
    Object.assign(team, updatedData);
    saveTeam(team, username);
  }
  validateTeam(username: string, teamId: number | string) {
    const teamsPath = getUserTeamsListJSONPath(username);
    const teamsData = readJSONFile(teamsPath);
    if (!teamsData[teamId]) {
      return false;
    }
    return teamsData[teamId];
  }
  deleteTeam(username: string, teamId: number | string) {
    const teamPath = getUserTeamJSONPath(username, teamId);
    deleteFile(teamPath);
    deleteTeamFromTeamlist(username, teamId);
  }
  /**
   * @param {string} username - owner of team
   * @param {Number} teamId - target team id
   * @param {JSON} playerData - id of the team to be copied
   * @returns {Number} - id of the new player
   */
  async addPlayer(
    username: string,
    teamId: number | string,
    playerData: Player,
  ): Promise<number> {
    try {
      this.defaultTeamCheck(username, teamId);
      const player = new Player(playerData);
      const team = await readTeamFile(username, teamId);
      const id = findNextFreePlayerId(team.squad);
      player.id = id;
      if (!team.squad.length) {
        team.squad.push(player);
      } else {
        team.squad.unshift(player);
      }
      console.log('Adding player to team', teamId);
      saveTeam(team, username);
      return id;
    } catch (error) {
      throw error;
    }
  }
  async updatePlayer(
    username: string,
    teamId: number | string,
    player: Player,
  ): Promise<void> {
    try {
      this.defaultTeamCheck(username, teamId);
      const team = await readTeamFile(username, teamId);
      console.log(`Updating player ${player.id} in team ${teamId}`);
      const playerIndex = team.squad.findIndex(
        (squadPlayer: Player) => Number(squadPlayer.id) === Number(player.id),
      );
      if (playerIndex !== -1) {
        team.squad[playerIndex] = player;
        saveTeam(team, username);
      } else {
        throw new Error('Player not found');
      }
    } catch (error) {
      throw error;
    }
  }
  async removePlayer(
    username: string,
    teamId: number | string,
    playerId: string | number,
  ): Promise<void> {
    try {
      this.defaultTeamCheck(username, teamId);
      const team = await readTeamFile(username, teamId);
      team.squad = team.squad.filter(
        (player: Player) => Number(player.id) !== Number(playerId),
      );
      saveTeam(team, username);
    } catch (error) {
      throw error;
    }
  }
  async findNextFreeTeamId(username: string): Promise<number> {
    const teamsPath = getUserTeamsListJSONPath(username);
    const teamsData: TeamListTeam[] = await readJSONFile(teamsPath);
    const sortedTeams = Object.values(teamsData).sort(
      (a: TeamListTeam, b: TeamListTeam) => a.id - b.id,
    );
    let nextFreeId = 0;
    for (let index = 0; index < sortedTeams.length; index += 1) {
      if (sortedTeams[index].id > nextFreeId) {
        return nextFreeId;
      }
      nextFreeId = sortedTeams[index].id + 1;
    }
    console.log(`New team ID: ${nextFreeId}`);
    return nextFreeId;
  }
  async addTeam(
    username: string,
    teamData: any,
    imageFileName: string,
  ): Promise<number> {
    try {
      const id = await this.findNextFreeTeamId(username);
      const team = new TeamExtended({
        ...teamData,
        id,
        lastUpdated: getDate(),
        crestUrl: generateCustomCrestUrl(id, imageFileName),
        hasCustomCrest: true,
        isDefault: false,
        hasDefault: false,
      }); // Replace TeamExtended with custom class that stores team in original (default) format
      saveTeam(team, username);
      addTeamToTeamlist(team, username);
      return id;
    } catch (error) {
      throw error;
    }
  }
  async resetTeam(username: string, teamId: number | string): Promise<boolean> {
    if (!hasTeamDefault(username, teamId)) {
      return false;
    }
    this.deleteTeam(username, teamId);
    const defaultUsername = 'default';
    await this.cloneTeamFromDefault(username, teamId);
    this.copyTeamListTeam(defaultUsername, username, teamId);
    return true;
  }
}
