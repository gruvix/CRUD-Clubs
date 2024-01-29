const userPath = '/user';
const resetPath = `${userPath}/reset`;
const teamPath = `${userPath}/team`;
const crestPath = `${userPath}/customCrest`;

const paths = {
  home: '/',
  user: userPath,
  team: teamPath,
  addTeam: `${teamPath}/add`,
  teams: `${userPath}/teams`,
  player: `${userPath}/player`,
  crest: `${crestPath}`,
  error: '/error',
  reset: resetPath,
  resetAll: `${resetPath}/all`,
  resetSingle: `${resetPath}`,
  login: `${userPath}/login`,
  logout: `${userPath}/logout`,
  generateCustomCrestUrl: (teamId, filename) => `${crestPath}/${teamId}/${filename}`,
};

module.exports = paths;
