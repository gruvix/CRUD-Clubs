const USER_PATH = '/user';
const resetPath = `${USER_PATH}/reset`;
const teamPath = `${USER_PATH}/team`;
const crestPath = `${USER_PATH}/customCrest`;
const WEBPACK_BASE_URL = 'http://localhost:8080';

const paths = {
  home: '/',
  user: USER_PATH,
  team: teamPath,
  addTeam: `${teamPath}/add`,
  teams: `${USER_PATH}/teams`,
  player: `${USER_PATH}/player`,
  crest: `${crestPath}`,
  error: '/error',
  reset: resetPath,
  resetAll: `${resetPath}/all`,
  resetSingle: `${resetPath}`,
  login: `${USER_PATH}/login`,
  logout: `${USER_PATH}/logout`,
  generateCustomCrestUrl: (teamId, filename) => `${crestPath}/${teamId}/${filename}`,
};

const redirectPaths = {
  home: WEBPACK_BASE_URL,
  teams: `${WEBPACK_BASE_URL}${paths.teams}`,
  generateTeamUrl: (teamId) => `${WEBPACK_BASE_URL}${paths.team}/${teamId}`,
  error: `${WEBPACK_BASE_URL}${paths.error}`,
};

module.exports = { paths, redirectPaths, WEBPACK_BASE_URL };
