import { apiRequestPaths } from '../../paths';

export default async function getTeamData(teamId) {
  const response = await fetch(apiRequestPaths.team.replace(':teamId', teamId), {
    method: 'get',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const data = await response.json();
    data.auth = true;
    return data;
  }
  if (response.status === 401) {
    return { auth: false };
  }
  throw new Error(`Can't get team's data: ${response.status}`);
}
