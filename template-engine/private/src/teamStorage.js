const TeamListTeam = require('../models/teamListTeam.js');
const generateUserPath = require('./path.js');
const {
  readFile,
  writeFile,
  copyFile,
  deleteFile,
} = require('./utils.js');
/**
 * @param {string} sourcePath - source path of teams to be copied
 * @param {string} targetPath - target path to place copy
 * @param {Number} teamId - id of the team to be copied
 */
function copyTeam(sourcePath, targetPath, teamId) {
  try {
    const sourceTeamPath = `${sourcePath}/teams/${teamId}.json`;
    const targetTeamPath = `${targetPath}/teams/${teamId}.json`;
    copyFile(sourceTeamPath, targetTeamPath);
  } catch (copyError) {
    throw new Error(copyError);
  }
}
function saveTeam(team, userPath) {
  try {
    const targetPath = `${userPath}/teams/${team.id}.json`
    const content = JSON.stringify(team);
    writeFile(targetPath, content);
  } catch (writeError) {
    throw new Error(writeError);
  }
}
function isTeamDefault(userPath, teamId) {
  const teamPath = `${userPath}/teams.json`;
  const teams = readFile(teamPath);
  const team = teams[teamId];
  if (team.isDefault) {
    return true;
  }
  return false;
}
/**
 * gets a team by id and username
 * @param {string} userPath - path to user folder
 * @param {Number} teamId
 */
function getTeamByIdAndPath(userPath, teamId) {
  try {
    const teamPath = `${userPath}/teams/${teamId}.json`;
    const team = readFile(teamPath);
    return team;
  } catch (error) {
    throw new Error(error);
  }
}
/**
 * @param {string} userPath - path to user folder
 * @param {Number} teamId
 * @param {string} parameter - teamlist parameter to be updated
 * @param {any} value - new value for parameter
 */
function updateTeamlistParameter(userPath, teamId, parameter, value) {
  const teamsPath = `${userPath}/teams.json`;
  const teams = readFile(teamsPath);
  teams[teamId][parameter] = value;
  writeFile(teamsPath, JSON.stringify(teams));
}
function copyTeamListTeam(sourcePath, targetPath, teamId) {
  const targetTeamsPath = `${targetPath}/teams.json`;
  const sourceTeamsPath = `${sourcePath}/teams.json`;
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
function copyTeamList(sourcePath, targetPath) {
  const defaultTeamsPath = `${sourcePath}/teams.json`;
  const teams = readFile(defaultTeamsPath);
  const teamPrepared = {};
  teams.forEach((team) => {
    teamPrepared[team.id] = new TeamListTeam(team);
  });
  try {
    const teamsPath = `${targetPath}/teams.json`;
    writeFile(teamsPath, JSON.stringify(teamPrepared));
  } catch (creationError) {
    throw new Error(creationError);
  }
}
function deleteTeamFromTeamlist(userPath, teamId) {
  const teamsPath = `${userPath}/teams.json`;
  const teams = readFile(teamsPath);
  delete teams[teamId];
  writeFile(teamsPath, JSON.stringify(teams));
}
function updateTeam(newData, userPath, teamId) {
  let updatedData = newData;
  if (isTeamDefault(userPath, teamId)) {
    copyTeam(generateUserPath('default'), userPath, teamId);
    updateTeamlistParameter(userPath, teamId, 'isDefault', false);
  }
  if (Object.keys(updatedData).includes('area')) {
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
      updateTeamlistParameter(userPath, teamId, key, updatedData[key]);
    }
  });
  const team = getTeamByIdAndPath(userPath, teamId);
  Object.assign(team, updatedData);

  saveTeam(team, userPath);
}
function validateTeam(userPath, teamId) {
  const teamsPath = `${userPath}/teams.json`;
  const teamsData = readFile(teamsPath);
  if (!teamsData[teamId]) {
    return false;
  }
  return teamsData[teamId];
}

function deleteTeam(userPath, teamId) {
  const teamPath = `${userPath}/teams/${teamId}.json`;
  deleteFile(teamPath);
  deleteTeamFromTeamlist(userPath, teamId);
}
module.exports = {
  copyTeam,
  isTeamDefault,
  getTeamByIdAndPath,
  copyTeamListTeam,
  copyTeamList,
  updateTeam,
  deleteTeam,
  deleteFile,
  validateTeam,
};
