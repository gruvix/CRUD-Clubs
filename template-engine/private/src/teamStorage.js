const TeamListTeam = require('../models/teamListTeam.js');
const {
  getUserTeamJSONPath,
  getUserTeamsListJSONPath,
} = require('./userPath.js');
const {
  readFile,
  writeFile,
  copyFile,
  deleteFile,
} = require('./utils.js');
/**
 * @param {string} sourceUser - username of copy source folder
 * @param {string} targetUser - username of copy target folder
 * @param {Number} teamId - id of the team to be copied
 */
function copyTeam(sourceUser, targetUser, teamId) {
  try {
    const sourceTeamPath = getUserTeamJSONPath(sourceUser, teamId);
    const targetTeamPath = getUserTeamJSONPath(targetUser, teamId);
    copyFile(sourceTeamPath, targetTeamPath);
  } catch (copyError) {
    throw new Error(copyError);
  }
}
function saveTeam(team, username) {
  try {
    const targetPath = getUserTeamJSONPath(username, team.id);
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
 * @param {any} value - new value for parameter
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
function updateTeam(newData, username, teamId) {
  let updatedData = newData;
  if (isTeamDefault(username, teamId)) {
    const defaultTeam = 'default';
    copyTeam(defaultTeam, username, teamId);
    const teamListParameter = 'isDefault';
    updateTeamlistParameter(username, teamId, teamListParameter, false);
  }
  const areaParameter = 'area';
  if (Object.keys(updatedData).includes(areaParameter)) {
    updatedData = {
      area: {
        name: updatedData.area,
      },
    };
  }
  const now = new Date();
  const lastUpdated = now.toISOString();
  updatedData.lastUpdated = lastUpdated;
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

function deleteTeam(userPath, teamId) {
  const teamPath = getUserTeamJSONPath(userPath, teamId);
  deleteFile(teamPath);
  deleteTeamFromTeamlist(userPath, teamId);
}
module.exports = {
  copyTeam,
  isTeamDefault,
  getTeam,
  getTeamsList,
  copyTeamListTeam,
  copyTeamList,
  updateTeam,
  deleteTeam,
  validateTeam,
};
