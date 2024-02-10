const BASE_API_URL = 'http://localhost:3000';

export const WEB_APP_PATHS = {
  home: '/',
  teams: '/user/teams',
  team: '/user/team/:teamId',
  addTeam: '/user/team/add',
  error: '/error',
};
export const API_REQUESTS_PATHS = {
  login: `${BASE_API_URL}/user/login`,
};
