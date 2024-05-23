import { BASE_API_URL } from '../../paths';

export default class TeamCard {
  id: number;
  name: string;
  crestUrl: string;
  hasDefault: boolean;
  [key: string]: number | string | boolean;
  constructor(teamData: any) {
    this.id = teamData.id;
    this.name = teamData.name;
    this.crestUrl = teamData.hasCustomCrest ? `${BASE_API_URL}${teamData.crestUrl}` : teamData.crestUrl;
    this.hasDefault = teamData.hasDefault;
  }
}
