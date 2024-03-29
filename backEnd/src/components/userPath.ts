/* eslint-disable max-len */
import path from "path";
/**
 * @param {string} username - username of the user
 * @returns the path to the root folder of the user E.g. ./private/userData/USERNAME
 */
export function getUserRootPath(username: string) {
  const projectRoot = __dirname;
  return path.join(projectRoot, "..", "userData", username);
}
/**
 * @param {string} username - username of the user
 * @param {boolean} fullpath - if true, return the full path to the teams.json file of the user, if false, return the relative path
 * @returns the path to the teams.json file of the user E.g. .../USERNAME/teams.json
 */
export function getUserTeamsListJSONPath(username: string, fullpath = true) {
  return fullpath ? `${getUserRootPath(username)}/teams.json` : "/teams.json";
}
/**
 * @param {string} username - username of the user
 * @param {boolean} fullpath - if true, return the full path to the custom crests user folder, if false, return the relative path
 * @returns the path to the custom crests folder of the user E.g. .../USERNAME/customCrests
 */
export function getUserCustomCrestFolderPath(
  username: string,
  fullpath = true
) {
  return fullpath
    ? `${getUserRootPath(username)}/customCrests`
    : "/customCrests";
}
/**
 * @param {string} username - username of the user
 * @param {string} teamId
 * @param {boolean} fullpath - if true, return the full path to the crest image file of the teamId of the user WITHOUT filetype, if false, return the relative path
 * @returns the path to the image file of the user (without type) E.g. .../USERNAME/customCrests/TEAMID
 */
export function getUserCustomCrestIMGPath(
  username: string,
  teamId: string | number,
  fullpath = true
) {
  return fullpath
    ? `${getUserCustomCrestFolderPath(username)}/${teamId}`
    : `${getUserCustomCrestFolderPath(username, false)}/${teamId}`;
}
/**
 * @param {string} username - username of the user
 * @param {boolean} fullpath - if true, return the full path to the teams folder of the user, if false, return the relative path
 * @returns the path to the image file of the user E.g. .../USERNAME/teams
 */
export function getUserTeamsFolderPath(username: string, fullpath = true) {
  return fullpath ? `${getUserRootPath(username)}/teams` : "/teams";
}
/**
 * @param {string} username - username of the user
 * @param {string} teamId
 * @param {boolean} fullpath - if true, return the full path to the teamId.json file of the user, if false, return the relative path
 * @returns the path to the image file of the user (without type) E.g. .../USERNAME/teams/teamId.json
 */
export function getUserTeamJSONPath(
  username: string,
  teamId: string | number,
  fullpath = true
) {
  return fullpath
    ? `${getUserTeamsFolderPath(username)}/${teamId}.json`
    : `${getUserTeamsFolderPath(username, false)}/${teamId}.json`;
}
