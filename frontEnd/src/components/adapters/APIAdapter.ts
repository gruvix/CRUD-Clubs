/* eslint-disable class-methods-use-this */
import { apiRequestPaths, webAppPaths } from '../../paths';
import Player from './Player';
import Team, { TeamParameters } from './Team';
import TeamCard from './TeamCard';

function responseRedirect(status: number) {
  if (status === 401) {
    return { redirect: webAppPaths.home };
  }
  if (status === 404) {
    return { redirect: `${webAppPaths.error}/404` };
  }
  return null;
}

export interface RedirectData {
  redirect: string;
}

export default class APIAdapter {
  async getTeamData(teamId: number | string) {
    const response = await fetch(apiRequestPaths.team(teamId), {
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
      return teamData;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }

  async updateTeam(teamId: number | string, newData: {[key: string]: (string | number)[]}) {
    const response = await fetch(apiRequestPaths.team(teamId), {
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
      const teamsData = { teams: {} as any };
      Object.keys(data.teams).forEach((key) => {
        teamsData.teams[key] = new TeamCard(data.teams[key]);
      });
      return teamsData;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }

  async deleteTeam(teamId: number | string) {
    const response = await fetch(apiRequestPaths.team(teamId), {
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

  async resetTeam(teamId: number | string) {
    const response = await fetch(apiRequestPaths.resetTeam(teamId), {
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

  async updatePlayer(teamId: number | string, playerData: Player) {
    const response = await fetch(apiRequestPaths.player(teamId), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
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

  async addPlayer(teamId: number | string, playerData: Player) {
    const response = await fetch(apiRequestPaths.player(teamId), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newId = await response.json();
      return newId;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }

  async addTeam(teamParameters: TeamParameters, players: Player[], imageFile: File) {
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
      const newTeamId = await response.json();
      return { redirect: webAppPaths.team.replace(':teamId', newTeamId) };
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }

  async updateTeamCrest(teamId: number | string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    const response = await fetch(apiRequestPaths.updateCrest(teamId), {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    try {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newCrestUrl = await response.json();
      return newCrestUrl;
    } catch (error) {
      const redirect = responseRedirect(response.status);
      if (redirect) {
        return redirect;
      }
      throw error;
    }
  }
}
