/* eslint-disable class-methods-use-this */
import { apiRequestPaths } from '../../paths';
import Team from './Team';

export default class TeamsAdapter {
  async getTeamData(teamId) {
    const response = await fetch(apiRequestPaths.team.replace(':teamId', teamId), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.auth = true;
      const teamData = new Team(data);
      return teamData;
    } catch (error) {
      if (response.status === 401) {
        return { other: { auth: false } };
      }
      throw error;
    }
  }

  async getTeamsData() {
    const response = await fetch(apiRequestPaths.teams, {
      method: 'get',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.auth = true;
      return data;
    } catch (error) {
      if (response.status === 401) {
        return { auth: false };
      }
      throw error;
    }
  }
}
