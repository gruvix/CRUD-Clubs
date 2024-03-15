import TeamListTeam from "./models/TeamListTeam";
import Player from "./models/Player";
import TeamExtended from "./models/TeamExtended";
import { getUserTeamJSONPath, getUserTeamsListJSONPath } from "./userPath";
import { readFile, writeFile, deleteFile } from "./utils";
import { paths } from "./routing/paths";

interface PlayerData {
  [key: string]: string | number;
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
export function isTeamDefault(username: string, teamId: number | string) {
  const teamsListPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsListPath);
  const team = teams[teamId];
  if (team.isDefault) {
    return true;
  }
  return false;
}
export function hasTeamDefault(username: string, teamId: number | string) {
  const teamsListPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsListPath);
  const team = teams[teamId];
  return team.hasDefault;
}
/**
 * gets a teams list by username
 * @param {string} username
 */
export function getTeamsList(username: string) {
  return readFile(getUserTeamsListJSONPath(username));
}
/**
 * gets a team by id and username
 * @param {string} username
 * @param {Number} teamId
 */
export function getTeam(username: string, teamId: number | string) {
  try {
    const teamPath = getUserTeamJSONPath(username, teamId);
    const team = readFile(teamPath);
    return team;
  } catch (error) {
    throw error;
  }
}
/**
 * @param {string} username
 * @param {Number} teamId
 * @param {string} parameter - teamlist parameter to be updated
 * @param {any} value - new value of parameter
 */
function updateTeamlistParameter(
  username: string,
  teamId: number | string,
  parameter: string,
  value: string | number | boolean
) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsPath);
  teams[teamId][parameter] = value;
  writeFile(teamsPath, JSON.stringify(teams));
}
export function copyTeamListTeam(
  sourceUser: string,
  targetUser: string,
  teamId: string | number
) {
  const sourceTeamsPath = getUserTeamsListJSONPath(sourceUser);
  const targetTeamsPath = getUserTeamsListJSONPath(targetUser);
  const userTeams = readFile(targetTeamsPath);
  const defaultTeams: TeamListTeam[] = readFile(sourceTeamsPath);

  const newTeam: TeamListTeam = Object.values(defaultTeams).find(
    (team: TeamListTeam) => team.id === Number(teamId)
  ) as TeamListTeam;
  try {
    userTeams[teamId] = new TeamListTeam(newTeam);
    writeFile(targetTeamsPath, JSON.stringify(userTeams));
  } catch (copyError) {
    throw copyError;
  }
}
export function copyTeamList(sourceUser: string, targetUser: string) {
  const defaultTeamsPath = getUserTeamsListJSONPath(sourceUser);
  const teams = readFile(defaultTeamsPath);
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
function deleteTeamFromTeamlist(username: string, teamId: number | string) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsPath);
  delete teams[teamId];
  writeFile(teamsPath, JSON.stringify(teams));
}
/**
 * @param {string} targetUser - username of copy target folder
 * @param {Number} teamId - id of the team to be copied
 */
export function cloneTeamFromDefault(
  targetUser: string,
  teamId: number | string
) {
  try {
    const DEFAULT_USER = "default";
    const team = getTeam(DEFAULT_USER, teamId);
    const teamClone = new TeamExtended(team);
    saveTeam(teamClone, targetUser);
  } catch (copyError) {
    throw copyError;
  }
}
function defaultTeamCheck(username: string, teamId: number | string) {
  try {
    if (isTeamDefault(username, teamId)) {
      cloneTeamFromDefault(username, teamId);
      const DEFAULT_TEAMLIST_PARAMETER = "isDefault";
      updateTeamlistParameter(
        username,
        teamId,
        DEFAULT_TEAMLIST_PARAMETER,
        false
      );
    }
  } catch (error) {
    throw error;
  }
}
/**
 * @returns {string} - Returns current date in ISOS string format
 */
function getDate() {
  const now = new Date();
  return now.toISOString();
}
export function updateTeam(
  newData: { [key: string]: string | number | boolean },
  username: string,
  teamId: number | string
) {
  const updatedData = newData;
  defaultTeamCheck(username, teamId);
  updatedData.lastUpdated = getDate();
  TeamListTeam.properties().forEach((key: string) => {
    if (updatedData[key] !== undefined) {
      updateTeamlistParameter(username, teamId, key, updatedData[key]);
    }
  });
  const team = getTeam(username, teamId);
  Object.assign(team, updatedData);
  saveTeam(team, username);
}
export function validateTeam(username: string, teamId: number | string) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teamsData = readFile(teamsPath);
  if (!teamsData[teamId]) {
    return false;
  }
  return teamsData[teamId];
}

export function deleteTeam(username: string, teamId: number | string) {
  const teamPath = getUserTeamJSONPath(username, teamId);
  deleteFile(teamPath);
  deleteTeamFromTeamlist(username, teamId);
}
function findNextFreePlayerId(players: Player[]): number {
  const sortedPlayers = [...players].sort((a: Player, b: Player) => a.id - b.id);

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
/**
 * @param {string} username - owner of team
 * @param {Number} teamId - target team id
 * @param {JSON} playerData - id of the team to be copied
 * @returns {Number} - id of the new player
 */
export function addPlayer(
  username: string,
  teamId: number | string,
  playerData: Player
) {
  try {
    defaultTeamCheck(username, teamId);
    const player = new Player(playerData);
    const originalTeam = getTeam(username, teamId);
    const team = originalTeam;
    const id = findNextFreePlayerId(team.squad);
    player.id = id;
    if (!team.squad.length) {
      team.squad.push(player);
    } else {
      team.squad.unshift(player);
    }
    console.log("Adding player to team", teamId);
    saveTeam(team, username);
    return id;
  } catch (error) {
    throw error;
  }
}
export function updatePlayer(
  username: string,
  teamId: number | string,
  player: PlayerData
) {
  try {
    defaultTeamCheck(username, teamId);
    const team = getTeam(username, teamId);
    console.log(`Updating player ${player.id} in team ${teamId}`);
    const playerIndex = team.squad.findIndex(
      (squadPlayer: PlayerData) => Number(squadPlayer.id) === Number(player.id)
    );
    if (playerIndex !== -1) {
      team.squad[playerIndex] = player;
      saveTeam(team, username);
    } else {
      throw new Error("Player not found");
    }
  } catch (error) {
    throw error;
  }
}
export function removePlayer(
  username: string,
  teamId: number | string,
  playerId: string | number
) {
  try {
    defaultTeamCheck(username, teamId);
    const team = getTeam(username, teamId);
    team.squad = team.squad.filter(
      (player: PlayerData) => Number(player.id) !== Number(playerId)
    );
    saveTeam(team, username);
  } catch (error) {
    throw error;
  }
}
export function findNextFreeTeamId(username: string) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teamsData: TeamListTeam[] = readFile(teamsPath);
  const sortedTeams = Object.values(teamsData).sort((a: TeamListTeam, b: TeamListTeam) => a.id - b.id);
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
function addTeamToTeamlist(newTeam: TeamExtended, username: string) {
  const userTeamsPath = getUserTeamsListJSONPath(username);
  const userTeams = readFile(userTeamsPath);
  userTeams[newTeam.id] = new TeamListTeam(newTeam as unknown as TeamListTeam, true, false, false);
  writeFile(userTeamsPath, JSON.stringify(userTeams));
}
export function addTeam(
  username: string,
  teamData: any,
  imageFileName: string
) {
  try {
    const id = findNextFreeTeamId(username);
    const team = new TeamExtended({
      ...teamData,
      id,
      lastUpdated: getDate(),
      crestUrl: paths.generateCustomCrestUrl(id, imageFileName),
      hasCustomCrest: true,
      isDefault: false,
      hasDefault: false,
    });
    saveTeam(team, username);
    addTeamToTeamlist(team, username);
    return id;
  } catch (error) {
    throw error;
  }
}
