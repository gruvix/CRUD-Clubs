const userPath = '/user';
const resetPath = `${userPath}/reset`;
const teamPath = `${userPath}/team`;

const paths = {
  home: '/',
  user: userPath,
  team: teamPath,
  addTeam: `${teamPath}/add`,
  teams: `${userPath}/teams`,
  player: `${userPath}/player`,
  crest: `${userPath}/customCrest`,
  error: '/error',
  reset: resetPath,
  resetAll: `${resetPath}/all`,
  resetSingle: `${resetPath}`,
  login: `${userPath}/login`,
  logout: `${userPath}/logout`,
};

module.exports = paths;
