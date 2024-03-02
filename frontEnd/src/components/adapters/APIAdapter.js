/* eslint-disable class-methods-use-this */
import { apiRequestPaths, webAppPaths } from '../../paths';
import Team from './Team';

function responseRedirect(status) {
  if (status === 401) {
    return { redirect: webAppPaths.home };
  }
  if (status === 404) {
    return { redirect: `${webAppPaths.error}/404` };
  }
  return null;
}

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
      const teamData = new Team(data);
      teamData.redirect = null;
      return teamData;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
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
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
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
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
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
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
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
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
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
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
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
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }

  async addTeam(teamParameters, players, imageFile) {
    const teamData = { ...teamParameters, squad: players };
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('teamData', JSON.stringify(teamData));
    const response = await fetch(apiRequestPaths.addTeam, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = {
        id: response.id,
      };
      return data;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }
}
