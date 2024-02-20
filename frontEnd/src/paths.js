const BASE_API_URL = 'http://localhost:3000';

export const webAppPaths = {
  home: '/',
  teams: '/user/teams',
  team: '/user/team/:teamId',
  addTeam: '/user/team/add',
  error: '/error',
};
export const apiRequestPaths = {
  login: `${BASE_API_URL}/user/login`,
  logout: `${BASE_API_URL}/user/logout`,
  teams: `${BASE_API_URL}/user/teams`,
  userStatus: `${BASE_API_URL}/user/status`,
};
