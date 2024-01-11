/**
 * @param {string} username - username of the user
 * @returns the path to the root of the user E.g. ./private/data/user/default
 */
function generateUserPath(username) {
  return `./private/userData/${username}`;
}
module.exports = generateUserPath;
