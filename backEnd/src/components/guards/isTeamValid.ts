import TeamStorageAdapter from '../Adapters/teamStorage.adapter';

const storage = new TeamStorageAdapter();
export default async function isTeamValid(
  username: string,
  teamId: number,
): Promise<boolean> {
  if (!(await storage.validateTeam(username, teamId))) {
    return false
  }
  return true;
}
