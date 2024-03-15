const USER_PATH = '/user';
const resetPath = `${USER_PATH}/reset`;
const teamPath = `${USER_PATH}/team`;
const crestPath = `${USER_PATH}/customCrest`;
const CLIENT_BASE_URL = 'http://localhost:8080';

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
  generateCustomCrestUrl: (teamId: number | string, filename: string) => `${crestPath}/${teamId}/${filename}`,
};

module.exports = { paths, CLIENT_BASE_URL };
