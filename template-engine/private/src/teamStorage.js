const TeamListTeam = require('../models/teamListTeam.js');
const SquadTeam = require('../models/squadTeam.js');
const Player = require('../models/player.js');
const TeamFullData = require('../models/teamFullData.js');
const {
  getUserTeamJSONPath,
  getUserTeamsListJSONPath,
} = require('./userPath.js');
const {
  readFile,
  writeFile,
  deleteFile,
} = require('./utils.js');
const paths = require('./routing/paths.js');

function saveTeam(team, username) {
  try {
    const targetPath = getUserTeamJSONPath(username, team.id);
    console.log(`Saving team ${team.id} to ${username} on ${targetPath}`);
    const content = JSON.stringify(team);
    writeFile(targetPath, content);
  } catch (writeError) {
    throw new Error(writeError);
  }
}
function isTeamDefault(username, teamId) {
  const teamsListPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsListPath);
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
function getTeamsList(username) {
  return readFile(getUserTeamsListJSONPath(username));
}
/**
 * gets a team by id and username
 * @param {string} username
 * @param {Number} teamId
 */
function getTeam(username, teamId) {
  try {
    const teamPath = getUserTeamJSONPath(username, teamId);
    const team = readFile(teamPath);
    return team;
  } catch (error) {
    throw new Error(error);
  }
}
/**
 * @param {string} username
 * @param {Number} teamId
 * @param {string} parameter - teamlist parameter to be updated
 * @param {any} value - new value of parameter
 */
function updateTeamlistParameter(username, teamId, parameter, value) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsPath);
  teams[teamId][parameter] = value;
  writeFile(teamsPath, JSON.stringify(teams));
}
function copyTeamListTeam(sourceUser, targetUser, teamId) {
  const sourceTeamsPath = getUserTeamsListJSONPath(sourceUser);
  const targetTeamsPath = getUserTeamsListJSONPath(targetUser);
  const userTeams = readFile(targetTeamsPath);
  const defaultTeams = readFile(sourceTeamsPath);

  const newTeam = Object.values(defaultTeams).find((team) => team.id === Number(teamId));
  try {
    userTeams[teamId] = new TeamListTeam(newTeam);
    writeFile(targetTeamsPath, JSON.stringify(userTeams));
  } catch (copyError) {
    throw new Error(copyError);
  }
}
function copyTeamList(sourceUser, targetUser) {
  const defaultTeamsPath = getUserTeamsListJSONPath(sourceUser);
  const teams = readFile(defaultTeamsPath);
  const teamPrepared = {};
  teams.forEach((team) => {
    teamPrepared[team.id] = new TeamListTeam(team);
  });
  try {
    const teamsPath = getUserTeamsListJSONPath(targetUser);
    writeFile(teamsPath, JSON.stringify(teamPrepared));
  } catch (creationError) {
    throw new Error(creationError);
  }
}
function deleteTeamFromTeamlist(username, teamId) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teams = readFile(teamsPath);
  delete teams[teamId];
  writeFile(teamsPath, JSON.stringify(teams));
}
/**
 * @param {string} sourceUser - username of copy source folder
 * @param {string} targetUser - username of copy target folder
 * @param {Number} teamId - id of the team to be copied
 */
function cloneTeamFromDefault(targetUser, teamId) {
  try {
    const DEFAULT_USER = 'default';
    const team = getTeam(DEFAULT_USER, teamId);
    const teamClone = new SquadTeam(team, true);
    saveTeam(teamClone, targetUser);
  } catch (copyError) {
    throw new Error(copyError);
  }
}
function defaultTeamCheck(username, teamId) {
  try {
    if (isTeamDefault(username, teamId)) {
      cloneTeamFromDefault(username, teamId);
      const DEFAULT_TEAMLIST_PARAMETER = 'isDefault';
      updateTeamlistParameter(username, teamId, DEFAULT_TEAMLIST_PARAMETER, false);
    }
  } catch (error) {
    throw new Error(error);
  }
}
/**
 * @returns {string} - Returns current date in ISOS string format
 */
function getDate() {
  const now = new Date();
  return now.toISOString();
}
function updateTeam(newData, username, teamId) {
  const updatedData = newData;
  defaultTeamCheck(username, teamId);
  updatedData.lastUpdated = getDate();
  TeamListTeam.properties().forEach((key) => {
    if (updatedData[key] !== undefined) {
      updateTeamlistParameter(username, teamId, key, updatedData[key]);
    }
  });
  const team = getTeam(username, teamId);
  Object.assign(team, updatedData);
  saveTeam(team, username);
}
function validateTeam(username, teamId) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teamsData = readFile(teamsPath);
  if (!teamsData[teamId]) {
    return false;
  }
  return teamsData[teamId];
}

function deleteTeam(username, teamId) {
  const teamPath = getUserTeamJSONPath(username, teamId);
  deleteFile(teamPath);
  deleteTeamFromTeamlist(username, teamId);
}
function findNextFreePlayerId(players) {
  const sortedPlayers = [...players].sort((a, b) => a.id - b.id);

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
function addPlayer(username, teamId, playerData) {
  try {
    defaultTeamCheck(username, teamId);
    const player = new Player(playerData);
    const originalTeam = getTeam(username, teamId);
    const team = originalTeam;
    const id = findNextFreePlayerId(team.squad);
    player.id = id;
    team.squad.unshift(player);
    console.log('Adding player to team', teamId);
    saveTeam(team, username);
    return id;
  } catch (error) {
    throw new Error(error);
  }
}
function updatePlayer(username, teamId, player) {
  try {
    defaultTeamCheck(username, teamId);
    const team = getTeam(username, teamId);
    console.log(`Updating player ${player.id} in team ${teamId}`);
    const playerIndex = team.squad
      .findIndex((squadPlayer) => Number(squadPlayer.id) === Number(player.id));
    if (playerIndex !== -1) {
      team.squad[playerIndex] = player;
      saveTeam(team, username);
    } else {
      throw new Error('Player not found');
    }
  } catch (error) {
    throw new Error(error);
  }
}
function removePlayer(username, teamId, playerId) {
  try {
    defaultTeamCheck(username, teamId);
    const team = getTeam(username, teamId);
    team.squad = team.squad.filter((player) => Number(player.id) !== Number(playerId));
    saveTeam(team, username);
  } catch (error) {
    throw new Error(error);
  }
}
function findNextFreeTeamId(username) {
  const teamsPath = getUserTeamsListJSONPath(username);
  const teamsData = readFile(teamsPath);
  const sortedTeams = Object.values(teamsData).sort((a, b) => a.id - b.id);
  let nextFreeId = 0;
  for (let index = 0; index < sortedTeams.length; index += 1) {
    if (sortedTeams[index].id > nextFreeId) {
      return nextFreeId;
    }
    nextFreeId = sortedTeams[index].id + 1;
    console.log(`Next free team ID: ${nextFreeId}`);
  }
  return nextFreeId;
}
function addTeamToTeamlist(newTeam, username) {
  const userTeamsPath = getUserTeamsListJSONPath(username);
  const userTeams = readFile(userTeamsPath);
  userTeams[newTeam.id] = new TeamListTeam(newTeam, true, false, false);
  writeFile(userTeamsPath, JSON.stringify(userTeams));
}
function addTeam(username, teamData, imageFileName) {
  try {
    const team = new TeamFullData(teamData);
    const teamId = findNextFreeTeamId(username);
    team.id = teamId;
    team.lastUpdated = getDate();
    team.crestUrl = paths.generateCustomCrestUrl(teamId, imageFileName);
    saveTeam(team, username);
    addTeamToTeamlist(team, username);
    return teamId;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  cloneTeamFromDefault,
  isTeamDefault,
  getTeam,
  getTeamsList,
  copyTeamListTeam,
  copyTeamList,
  updateTeam,
  deleteTeam,
  validateTeam,
  addPlayer,
  updatePlayer,
  removePlayer,
  addTeam,
};
