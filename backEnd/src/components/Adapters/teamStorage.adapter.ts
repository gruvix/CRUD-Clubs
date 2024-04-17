import TeamListTeam from '../models/TeamListTeam';
import Player from '../models/Player';
import TeamExtended from '../models/TeamExtended';
import {
  generateCustomCrestUrl,
  getUserTeamJSONPath,
  getUserTeamsListJSONPath,
} from '../storage/userPath';
import { readJSONFile, writeFile, deleteFile } from '../storage/dataStorage';
import TeamIsNotResettableError from '../errors/TeamIsNotResettableError';
import NoDataProvidedError from '../errors/NoDataProvidedError';

async function readTeamFile(
  username: string,
  teamId: number,
): Promise<TeamExtended> {
  try {
    const teamPath = getUserTeamJSONPath(username, teamId);
    const team = new TeamExtended(await readJSONFile(teamPath));
    return team;
  } catch (error) {
    throw error;
  }
}
async function saveTeam(team: TeamExtended, username: string): Promise<void> {
  try {
    const targetPath = getUserTeamJSONPath(username, team.id);
    console.log(`Saving team ${team.id} to ${username} on ${targetPath}`);
    await writeFile(targetPath, JSON.stringify(team));
  } catch (error) {
    throw error;
  }
}
async function updateTeamlistTeam(
  username: string,
  teamId: number,
  newData: { [key: string]: string | number | boolean },
) {
  try {
    const teamsPath = getUserTeamsListJSONPath(username);
    const teams = await readJSONFile(teamsPath);
    Object.assign(teams[teamId], newData);
    await writeFile(teamsPath, JSON.stringify(teams));
  } catch (error) {
    throw error;
  }
}
async function addTeamToTeamlist(
  newTeam: TeamExtended,
  username: string,
): Promise<void> {
  const userTeamsPath = getUserTeamsListJSONPath(username);
  const userTeams = await readJSONFile(userTeamsPath);
  userTeams[newTeam.id] = new TeamListTeam(newTeam as unknown as TeamListTeam);
  await writeFile(userTeamsPath, JSON.stringify(userTeams));
}
async function deleteTeamFromTeamlist(
  username: string,
  teamId: number,
): Promise<void> {
  try {
    const teamsPath = getUserTeamsListJSONPath(username);
    const teams = await readJSONFile(teamsPath);
    delete teams[teamId];
    await writeFile(teamsPath, JSON.stringify(teams));
  } catch (error) {
    throw error;
  }
}
export function getDate(): string {
  const now = new Date();
  return now.toISOString();
}
async function hasTeamDefault(
  username: string,
  teamId: number,
): Promise<boolean> {
  try {
    const teamsListPath = getUserTeamsListJSONPath(username);
    const teams = await readJSONFile(teamsListPath);
    const team = teams[teamId];
    return team.hasDefault;
  } catch (error) {
    console.log('Failed to get teams list');
    throw error;
  }
}
export default class TeamStorageAdapter {
  private async ensureTeamIsUnDefault(
    username: string,
    teamId: number,
  ): Promise<void> {
    try {
      if (await this.isTeamDefault(username, teamId)) {
        await this.cloneTeamFromDefault(username, teamId);
        const clonedTeamIsDefaultProperty = { isDefault: false };
        await updateTeamlistTeam(username, teamId, clonedTeamIsDefaultProperty);
      }
    } catch (error) {
      throw error;
    }
  }
  findNextFreePlayerId(players: Player[]): number {
    const sortedPlayers = [...players].sort(
      (a: Player, b: Player) => a.id - b.id,
    );
    let nextFreeId = 0;
    for (let index = 0; index < sortedPlayers.length; index += 1) {
      if (sortedPlayers[index].id > nextFreeId) {
        return nextFreeId;
      }
      nextFreeId = sortedPlayers[index].id + 1;
    }
    return nextFreeId;
  }
  async isTeamDefault(username: string, teamId: number): Promise<boolean> {
    try {
      const teamsListPath = getUserTeamsListJSONPath(username);
      const teams = await readJSONFile(teamsListPath);
      const team = teams[teamId];
      if (team.isDefault) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  async getTeamsList(username: string): Promise<TeamListTeam[]> {
    try {
      return await readJSONFile(getUserTeamsListJSONPath(username));
    } catch (error) {
      console.log('Failed to get teams list');
      throw error;
    }
  }
  async getTeam(username: string, teamId: number): Promise<TeamExtended> {
    const teamDefaultBool = await this.isTeamDefault(username, teamId);
    try {
      let sourceUserName = 'default';
      !teamDefaultBool ? (sourceUserName = username) : null;
      const team = new TeamExtended({
        ...(await readTeamFile(sourceUserName, teamId)),
        hasDefault: await hasTeamDefault(username, teamId),
      });
      return team;
    } catch (error) {
      throw error;
    }
  }
  async copyTeamListTeam(
    sourceUser: string,
    targetUser: string,
    teamId: number,
  ): Promise<void> {
    try {
      if (sourceUser === targetUser)
        throw new Error('Source and target users must be different');
      const sourceTeamsPath = getUserTeamsListJSONPath(sourceUser);
      const targetTeamsPath = getUserTeamsListJSONPath(targetUser);
      const userTeams: TeamListTeam[] = await readJSONFile(targetTeamsPath);
      const sourceTeams: TeamListTeam[] = await readJSONFile(sourceTeamsPath);
      const newTeam: TeamListTeam = Object.values(sourceTeams).find(
        (team: TeamListTeam) => team.id === Number(teamId),
      ) as TeamListTeam;
      userTeams[teamId] = new TeamListTeam(newTeam);
      await writeFile(targetTeamsPath, JSON.stringify(userTeams));
    } catch (error) {
      throw error;
    }
  }
  async copyTeamsList(sourceUser: string, targetUser: string): Promise<void> {
    try {
      if (sourceUser === targetUser)
        throw new Error('Source and target users must be different');
      const sourceTeamsPath = getUserTeamsListJSONPath(sourceUser);
      const teams = await readJSONFile(sourceTeamsPath);
      const teamsPath = getUserTeamsListJSONPath(targetUser);
      await writeFile(teamsPath, JSON.stringify(teams));
    } catch (error) {
      throw error;
    }
  }
  async cloneTeamFromDefault(targetUser: string, teamId: number) {
    try {
      const DEFAULT_USER = 'default';
      const team = await readTeamFile(DEFAULT_USER, teamId);
      await saveTeam(team, targetUser);
    } catch (error) {
      throw error;
    }
  }
  async updateTeam(
    newData: { [key: string]: string | number | boolean },
    username: string,
    teamId: number,
  ): Promise<void> {
    const updatedData = newData;
    if (!updatedData || !Object.keys(updatedData)) {
      throw new NoDataProvidedError();
    }
    try {
      await this.ensureTeamIsUnDefault(username, teamId);
      updatedData.lastUpdated = getDate();
      const teamlistData = {};
      TeamListTeam.properties().forEach((property) => {
        if (!updatedData[property]) return;
        teamlistData[property] = updatedData[property];
      });
      await updateTeamlistTeam(username, teamId, teamlistData);
      const team = await readTeamFile(username, teamId);
      Object.assign(team, updatedData);
      await saveTeam(team, username);
    } catch (error) {
      throw error;
    }
  }
  async validateTeam(
    username: string,
    teamId: number,
  ): Promise<boolean | string | number> {
    try {
      const teamsPath = getUserTeamsListJSONPath(username);
      const teamsData = await readJSONFile(teamsPath);
      if (!teamsData[teamId]) {
        return false;
      }
      return teamsData[teamId];
    } catch (error) {
      throw error;
    }
  }
  async deleteTeam(username: string, teamId: number): Promise<void> {
    try {
      const teamPath = getUserTeamJSONPath(username, teamId);
      await deleteFile(teamPath);
      await deleteTeamFromTeamlist(username, teamId);
    } catch (error) {
      throw error;
    }
  }
  async addPlayer(
    username: string,
    teamId: number,
    playerData: Player,
  ): Promise<void> {
    try {
      if (!playerData || !Object.keys(playerData).length) {
        throw new NoDataProvidedError();
      }
      await this.ensureTeamIsUnDefault(username, teamId);
      const player = new Player(playerData);
      const team = await readTeamFile(username, teamId);
      team.lastUpdated = getDate();
      if (!team.squad.length) {
        team.squad.push(player);
      } else {
        team.squad.unshift(player);
      }
      console.log('Adding player to team', teamId);
      await saveTeam(team, username);
    } catch (error) {
      throw error;
    }
  }
  async updatePlayer(
    username: string,
    teamId: number,
    player: Player,
  ): Promise<void> {
    try {
      if (!player || !Object.keys(player).length) {
        throw new NoDataProvidedError();
      }
      await this.ensureTeamIsUnDefault(username, teamId);
      const team = await readTeamFile(username, teamId);
      team.lastUpdated = getDate();
      console.log(`Updating player ${player.id} in team ${teamId}`);
      const playerIndex = team.squad.findIndex(
        (squadPlayer: Player) => Number(squadPlayer.id) === Number(player.id),
      );
      if (playerIndex !== -1) {
        team.squad[playerIndex] = player;
        await saveTeam(team, username);
      } else {
        throw new Error('Player not found');
      }
    } catch (error) {
      throw error;
    }
  }
  async removePlayer(
    username: string,
    teamId: number,
    playerId: string | number,
  ): Promise<void> {
    try {
      await this.ensureTeamIsUnDefault(username, teamId);
      const team = await readTeamFile(username, teamId);
      team.lastUpdated = getDate();
      team.squad = team.squad.filter(
        (player: Player) => Number(player.id) !== Number(playerId),
      );
      await saveTeam(team, username);
    } catch (error) {
      throw error;
    }
  }
  findNextFreeTeamId(teamsList: TeamListTeam[]): number {
    const sortedTeams = Object.values(teamsList).sort(
      (a: TeamListTeam, b: TeamListTeam) => a.id - b.id,
    );
    let nextFreeId = 0;
    for (let index = 0; index < sortedTeams.length; index += 1) {
      if (sortedTeams[index].id > nextFreeId) {
        return nextFreeId;
      }
      nextFreeId = sortedTeams[index].id + 1;
    }
    return nextFreeId;
  }
  async addTeam(
    username: string,
    teamData: any,
    teamId: number,
    imageFileName: string,
  ): Promise<void> {
    try {
      if (!teamData || !Object.keys(teamData).length) {
        throw new NoDataProvidedError();
      }
      const team = new TeamExtended({
        ...teamData,
        id: teamId,
        lastUpdated: getDate(),
        crestUrl: generateCustomCrestUrl(teamId, imageFileName),
        hasCustomCrest: true,
        isDefault: false,
        hasDefault: false,
      }); // Replace TeamExtended with custom class that stores team in original (default) format
      Promise.all([
        saveTeam(team, username),
        addTeamToTeamlist(team, username),
      ]);
    } catch (error) {
      throw error;
    }
  }
  async resetTeam(username: string, teamId: number): Promise<void> {
    if (!(await hasTeamDefault(username, teamId))) {
      throw new TeamIsNotResettableError();
    }
    try {
      await this.deleteTeam(username, teamId);
      const defaultUsername = 'default';
      Promise.all([
        this.cloneTeamFromDefault(username, teamId),
        this.copyTeamListTeam(defaultUsername, username, teamId),
      ]);
    } catch (error) {
      throw new Error('Team reset failed' + error);
    }
  }
}
