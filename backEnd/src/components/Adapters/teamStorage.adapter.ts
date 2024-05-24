import TeamShort from '@comp/models/TeamShort';
import PlayerDataOld from '@comp/models/playerData.old';
import TeamExtendedOld from '@comp/models/TeamExtended.old';
import {
  generateCustomCrestUrl,
  getUserTeamJSONPath,
  getUserTeamsListJSONPath,
} from '@comp/storage/userPath';
import { readJSONFile, writeFile, deleteFile } from '@comp/storage/dataStorage';
import TeamIsNotResettableError from '@comp/errors/TeamIsNotResettableError';
import NoDataProvidedError from '@comp/errors/NoDataProvidedError';

async function readTeamFile(
  username: string,
  teamId: number,
): Promise<TeamExtendedOld> {
  try {
    const teamPath = getUserTeamJSONPath(username, teamId);
    const team = new TeamExtendedOld(await readJSONFile(teamPath));
    return team;
  } catch (error) {
    throw error;
  }
}
async function saveTeam(team: TeamExtendedOld, username: string): Promise<void> {
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
  newTeam: TeamExtendedOld,
  username: string,
): Promise<void> {
  const userTeamsPath = getUserTeamsListJSONPath(username);
  const userTeams = await readJSONFile(userTeamsPath);
  userTeams[newTeam.id] = new TeamShort(newTeam as unknown as TeamShort);
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
  findNextFreePlayerId(players: PlayerDataOld[]): number {
    const sortedPlayers = [...players].sort(
      (a: PlayerDataOld, b: PlayerDataOld) => a.id - b.id,
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
  async getTeamsList(username: string): Promise<TeamShort[]> {
    try {
      return await readJSONFile(getUserTeamsListJSONPath(username));
    } catch (error) {
      console.log('Failed to get teams list');
      throw error;
    }
  }
  async getTeam(username: string, teamId: number): Promise<TeamExtendedOld> {
    const teamDefaultBool = await this.isTeamDefault(username, teamId);
    try {
      let sourceUserName = 'default';
      !teamDefaultBool ? (sourceUserName = username) : null;
      const team = new TeamExtendedOld({
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
      const userTeams: TeamShort[] = await readJSONFile(targetTeamsPath);
      const sourceTeams: TeamShort[] = await readJSONFile(sourceTeamsPath);
      const newTeam: TeamShort = Object.values(sourceTeams).find(
        (team: TeamShort) => team.id === Number(teamId),
      ) as TeamShort;
      userTeams[teamId] = new TeamShort(newTeam);
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
      TeamShort.properties().forEach((property) => {
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
    playerData: PlayerDataOld,
  ): Promise<void> {
    try {
      if (!playerData || !Object.keys(playerData).length) {
        throw new NoDataProvidedError();
      }
      await this.ensureTeamIsUnDefault(username, teamId);
      const player = new PlayerDataOld(playerData);
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
    player: PlayerDataOld,
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
        (squadPlayer: PlayerDataOld) => Number(squadPlayer.id) === Number(player.id),
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
        (player: PlayerDataOld) => Number(player.id) !== Number(playerId),
      );
      await saveTeam(team, username);
    } catch (error) {
      throw error;
    }
  }
  findNextFreeTeamId(teamsList: TeamShort[]): number {
    const sortedTeams = Object.values(teamsList).sort(
      (a: TeamShort, b: TeamShort) => a.id - b.id,
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
  async addTeam(username: string, teamData: any): Promise<void> {
    if (!teamData || !Object.keys(teamData).length) {
      throw new NoDataProvidedError();
    }
    try {
      const team = new TeamExtendedOld({
        ...teamData,
        lastUpdated: getDate(),
        hasCustomCrest: true,
        isDefault: false,
        hasDefault: false,
      }); // Replace TeamExtended with custom class that stores team in original (default) format
      await saveTeam(team, username);
      await addTeamToTeamlist(team, username);
    } catch (error) {
      throw error;
    }
  }
  async resetTeam(username: string, teamId: number): Promise<void> {
    if (!(await hasTeamDefault(username, teamId))) {
      throw new TeamIsNotResettableError();
    }
    try {
      const teamPath = getUserTeamJSONPath(username, teamId);
      await deleteFile(teamPath);
      const defaultUsername = 'default';
      await Promise.all([
        this.cloneTeamFromDefault(username, teamId),
        this.copyTeamListTeam(defaultUsername, username, teamId),
      ]);
    } catch (error) {
      throw new Error('Team reset failed - ' + error);
    }
  }
}
