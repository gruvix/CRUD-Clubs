import { apiRequestPaths } from '../../paths.js';

export default async function getTeamsData() {
  const response = await fetch(apiRequestPaths.teams, {
    method: 'get',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    console.log(response);
  } else if (response.status === 401) {
    console.log('Can\'t get team\'s data: Unauthorized');
  }
}
