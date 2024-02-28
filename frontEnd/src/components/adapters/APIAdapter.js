/* eslint-disable class-methods-use-this */
import { apiRequestPaths } from '../../paths';
import Team from './Team';

export default class APIAdapter {
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

  async updateTeam(teamId, newData) {
    const response = await fetch(apiRequestPaths.team.replace(':teamId', teamId), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response;
      data.auth = true;
      return data;
    } catch (error) {
      if (response.status === 401) {
        return { auth: false };
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

  async deleteTeam(teamId) {
    const response = await fetch(apiRequestPaths.team.replace(':teamId', teamId), {
      method: 'DELETE',
      credentials: 'include',
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response;
      data.auth = true;
      return data;
    } catch (error) {
      if (response.status === 401) {
        return { auth: false };
      }
      throw error;
    }
  }

  async resetTeamsList() {
    const response = await fetch(apiRequestPaths.resetAll, {
      method: 'PUT',
      credentials: 'include',
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response;
      data.auth = true;
      return data;
    } catch (error) {
      if (response.status === 401) {
        return { auth: false };
      }
      throw error;
    }
  }

  async resetTeam(teamId) {
    const response = await fetch(apiRequestPaths.resetTeam.replace(':teamId', teamId), {
      method: 'PUT',
      credentials: 'include',
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response;
      data.auth = true;
      return data;
    } catch (error) {
      if (response.status === 401) {
        return { auth: false };
      }
      throw error;
    }
  }

  async updatePlayer(teamId, newData) {
    const response = await fetch(apiRequestPaths.player.replace(':teamId', teamId), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response;
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
