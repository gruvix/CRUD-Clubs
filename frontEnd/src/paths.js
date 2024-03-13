export const BASE_API_URL = 'http://localhost:3000';

export const webAppPaths = {
  home: '/',
  user: '/user',
  teams: '/user/teams',
  team: (teamId) => `/user/team/${teamId}`,
  addTeam: '/user/team/add',
  error: (code) => `/error/${code}`,
};
export const apiRequestPaths = {
  login: `${BASE_API_URL}/user/login`,
  logout: `${BASE_API_URL}/user/logout`,
  teams: `${BASE_API_URL}/user/teams`,
  team: (teamId) => `${BASE_API_URL}/user/team/${teamId}`,
  addTeam: `${BASE_API_URL}/user/team/add`,
  player: (teamId) => `${BASE_API_URL}/user/player/${teamId}`,
  updateCrest: (teamId) => `${BASE_API_URL}/user/customCrest/${teamId}`,
  userStatus: `${BASE_API_URL}/user/status`,
  resetAll: `${BASE_API_URL}/user/reset/all`,
  resetTeam: (teamId) => `${BASE_API_URL}/user/reset/${teamId}`,
};
