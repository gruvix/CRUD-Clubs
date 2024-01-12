/* eslint-disable max-len */
/**
 * @param {string} username - username of the user
 * @returns the path to the root folder of the user E.g. ./private/userData/USERNAME
 */
function getUserRootPath(username) {
  return `./private/userData/${username}`;
}
/**
 * @param {string} username - username of the user
 * @param {boolean} fullpath - if true, return the full path to the teams.json file of the user, if false, return the relative path
 * @returns the path to the teams.json file of the user E.g. .../USERNAME/teams.json
 */
function getUserTeamsListJSONPath(username, fullpath = true) {
  return fullpath ? `${getUserRootPath(username)}/teams.json` : '/teams.json';
}
/**
 * @param {string} username - username of the user
 * @param {boolean} fullpath - if true, return the full path to the custom crests user folder, if false, return the relative path
 * @returns the path to the custom crests folder of the user E.g. .../USERNAME/customCrests
 */
function getUserCustomCrestFolderPath(username, fullpath = true) {
  return fullpath ? `${getUserRootPath(username)}/customCrests` : '/customCrests';
}
/**
 * @param {string} username - username of the user
 * @param {string} teamId
 * @param {boolean} fullpath - if true, return the full path to the crest image file of the teamId of the user, if false, return the relative path
 * @returns the path to the image file of the user (without type) E.g. .../USERNAME/customCrests/TEAMID
 */
function getUserCustomCrestIMGPath(username, teamId, fullpath = true) {
  return fullpath ? `${getUserCustomCrestFolderPath(username)}/${teamId}` : `${getUserCustomCrestFolderPath(username, false)}/${teamId}`;
}
/**
 * @param {string} username - username of the user
 * @param {boolean} fullpath - if true, return the full path to the teams folder of the user, if false, return the relative path
 * @returns the path to the image file of the user E.g. .../USERNAME/teams
 */
function getUserTeamsFolderPath(username, fullpath = true) {
  return fullpath ? `${getUserRootPath(username)}/teams` : '/teams';
}
/**
 * @param {string} username - username of the user
 * @param {string} teamId
 * @param {boolean} fullpath - if true, return the full path to the teamId.json file of the user, if false, return the relative path
 * @returns the path to the image file of the user (without type) E.g. .../USERNAME/teams/teamId.json
 */
function getUserTeamJSONPath(username, teamId, fullpath = true) {
  return fullpath ? `${getUserTeamsFolderPath(username)}/${teamId}.json` : `${getUserTeamsFolderPath(username, false)}/${teamId}.json`;
}
module.exports = {
  getUserRootPath,
  getUserTeamsListJSONPath,
  getUserCustomCrestFolderPath,
  getUserCustomCrestIMGPath,
  getUserTeamsFolderPath,
  getUserTeamJSONPath,
};
