import { BASE_API_URL } from '../../paths';

export default class TeamCard {
  id: number;
  name: string;
  crestUrl: string;
  isDefault: boolean;
  lastUpdated: string;
  [key: string]: number | string | boolean;
  constructor(teamData: any) {
    this.id = teamData.id;
    this.name = teamData.name;
    this.crestUrl = teamData.hasCustomCrest ? `${BASE_API_URL}${teamData.crestUrl}` : teamData.crestUrl;
    this.isDefault = teamData.hasDefault;
    this.lastUpdated = teamData.lastUpdated;
  }
}
