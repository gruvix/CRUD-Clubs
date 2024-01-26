const TeamListTeam = require('../models/teamListTeam.js');
const SquadTeam = require('../models/squadTeam.js');
const {
  getUserTeamJSONPath,
  getUserTeamsListJSONPath,
} = require('./userPath.js');
const {
  readFile,
  writeFile,
  deleteFile,
} = require('./utils.js');

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
function updateTeam(newData, username, teamId) {
  const updatedData = newData;
  defaultTeamCheck(username, teamId);
  const now = new Date();
  const lastUpdated = now.toISOString();
  updatedData.lastUpdated = lastUpdated;
  TeamListTeam.properties().forEach((key) => {
    if (updatedData[key] !== undefined) {
      updateTeamlistParameter(username, teamId, key, updatedData[key]);
    }
  });
  const team = getTeam(username, teamId);
  if (Object.keys(updatedData).includes('squad')) {
    const oldPlayers = team.squad;
    Object.assign(team, updatedData);
    team.squad = [];
    Object.assign(team.squad, oldPlayers);
    Object.assign(team.squad, updatedData.squad);
  } else {
    Object.assign(team, updatedData);
  }
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

function addPlayersToTeam(username, teamId, players) {
  try {
    defaultTeamCheck(username, teamId);
    const originalTeam = getTeam(username, teamId);
    const team = {};
    team.squad = originalTeam.squad;
    Object.keys(players).forEach((player) => {
      team.squad.push(players[player]);
    });
    updateTeam(team, username, teamId);
    return true;
  } catch (error) {
    return error;
  }
}
function updatePlayer(username, teamId, player) {
  try {
    defaultTeamCheck(username, teamId);
    const team = getTeam(username, teamId);
    console.log(`Updating player ${player.id} in team ${teamId}`);
    let foundPlayer = false;
    for (let index = 0; index < team.squad.length; index += 1) {
      if (Number(team.squad[index].id) === Number(player.id)) {
        team.squad[index] = player;
        foundPlayer = true;
        break;
      }
    }
    if (foundPlayer) {
      saveTeam(team, username);
    } else {
      throw new Error('Player not found');
    }
  } catch (error) {
    throw new Error(error);
  }
}
function removePlayer(username, teamId, playerId) {
    saveTeam(team, username);
  } catch (error) {
    console.log(error);
  }
  return true;
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
  addPlayersToTeam,
  updatePlayer,
  removePlayer,
};
