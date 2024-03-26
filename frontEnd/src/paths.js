export const BASE_API_URL = "http://localhost:3000";

export const webAppPaths = {
  home: "/",
  user: "/user",
  teams: "/user/teams",
  team: (teamId) => `/user/team/${teamId}`,
  addTeam: "/user/team/add",
  error: (code) => `/error/${code}`,
};
export const apiRequestPaths = {
  teams: `${BASE_API_URL}/user/teams`,
  team: (teamId) => `${BASE_API_URL}/user/team/${teamId}`,
  addTeam: `${BASE_API_URL}/user/team/add`,
  player: (teamId) => `${BASE_API_URL}/user/team/${teamId}/player`,
  updateCrest: (teamId) => `${BASE_API_URL}/user/customCrest/${teamId}`,
  user: `${BASE_API_URL}/user`,
};
