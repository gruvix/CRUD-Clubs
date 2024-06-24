export const baseAPIUrl = process.env.BASE_API_URL;

export const webAppPaths = {
  home: "/",
  user: "/user",
  teams: "/user/teams",
  team: (teamId) => `/user/team/${teamId}`,
  addTeam: "/user/team/add",
  error: (code) => `/error/${code}`,
};
export const apiRequestPaths = {
  teams: `${baseAPIUrl}/user/teams`,
  team: (teamId) => `${baseAPIUrl}/user/team/${teamId}`,
  addTeam: `${baseAPIUrl}/user/team/add`,
  player: (teamId) => `${baseAPIUrl}/user/team/${teamId}/player`,
  updateCrest: (teamId) => `${baseAPIUrl}/user/customCrest/${teamId}`,
  user: `${baseAPIUrl}/user`,
};
