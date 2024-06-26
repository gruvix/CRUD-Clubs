import { baseAPIUrl, apiRequestPaths } from "../../paths";
import UnauthorizedError from "@/components/errors/UnauthorizedError";
import validateUsername from "../shared/usernameValidation";
import Player from "./Player";
import Team, { TeamParameters } from "./Team";
import TeamCard from "./TeamCard";
import TeamNotFoundError from "../errors/TeamNotFoundError";
import TeamNotResettableError from "../errors/TeamNotResettableError";
import UnsupportedMediaTypeError from "../errors/UnsupportedMediaTypeError";
import PlayerNotFoundError from "../errors/PlayerNotFoundError";

export default class APIAdapter {
  async login(username: string) {
    const error = validateUsername(username);
    if (error) {
      throw new Error(error);
    }
    const response = await fetch(apiRequestPaths.user, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }
  }
  async logout() {
    const response = await fetch(apiRequestPaths.user, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }
  }
  async getUserStatus(): Promise<boolean> {
    const response = await fetch(apiRequestPaths.user, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      switch (response.status) {
        case 401:
          return false;
        case 403:
          return false; //this function works different to other adapter unAuthorized status returns, since its job is to get the login status
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    return true;
  }
  async getTeam(teamId: number | string): Promise<Team> {
    const response = await fetch(apiRequestPaths.team(teamId), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new TeamNotFoundError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = await response.json();
    const teamData = new Team(data);
    return teamData;
  }
  async updateTeam(
    teamId: number | string,
    newData: { [key: string]: (string | number)[] },
  ) {
    const parsedData = {} as TeamParameters;
    for (const [key, value] of Object.entries(newData)) {
      parsedData[key] = value[0];
    }
    const response = await fetch(apiRequestPaths.team(teamId), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedData),
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new TeamNotFoundError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = response;
    return data;
  }
  async getTeams() {
    const response = await fetch(apiRequestPaths.teams, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 409:
          await this.logout();
          throw new UnauthorizedError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = await response.json();
    const teamsData = {
      teams: [] as TeamCard[],
      username: data.username as string,
    };
    Object.keys(data.teams).forEach((key) => {
      teamsData.teams.push(new TeamCard(data.teams[key]))
    });
    return teamsData;
  }
  async deleteTeam(teamId: number | string) {
    const response = await fetch(apiRequestPaths.team(teamId), {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new TeamNotFoundError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = response;
    return data;
  }
  async resetTeamsList() {
    const response = await fetch(apiRequestPaths.teams, {
      method: "PUT",
      credentials: "include",
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = response;
    return data;
  }
  async resetTeam(teamId: number | string) {
    const response = await fetch(apiRequestPaths.team(teamId), {
      method: "PUT",
      credentials: "include",
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new TeamNotFoundError();
        case 422:
          throw new TeamNotResettableError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = response;
    return data;
  }
  async updatePlayer(teamId: number | string, playerData: Player) {
    const response = await fetch(apiRequestPaths.player(teamId), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new PlayerNotFoundError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const data = response;
    return data;
  }
  async addPlayer(
    teamId: number | string,
    playerData: Player,
  ): Promise<number> {
    const response = await fetch(apiRequestPaths.player(teamId), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new TeamNotFoundError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const newId = await response.json();
    return newId;
  }
  async removePlayer(teamId: number, playerId: number) {
    const playerData = { id: playerId };
    const response = await fetch(apiRequestPaths.player(teamId), {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 404:
          throw new TeamNotFoundError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    return true;
  }
  async addTeam(
    teamParameters: TeamParameters,
    players: Player[],
    imageFile: File,
  ): Promise<number> {
    const squad = [] as object[];
    Object.keys(players).forEach((player, index) => {
      squad.push({ ...players[Number(player)], id: index });
    });
    const teamData = { ...teamParameters, squad };
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("teamData", JSON.stringify(teamData));
    const response = await fetch(apiRequestPaths.addTeam, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 415:
          throw new UnsupportedMediaTypeError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const newTeamId = await response.json();
    return newTeamId;
  }
  async updateTeamCrest(teamId: number | string, image: File) {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(apiRequestPaths.updateCrest(teamId), {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      switch (response.status) {
        case 403:
          throw new UnauthorizedError();
        case 415:
          throw new UnsupportedMediaTypeError();
        default:
          throw new Error(`${response.status} - ${response.statusText}`);
      }
    }
    const newCrestUrl = baseAPIUrl + (await response.json());
    return newCrestUrl;
  }
}
