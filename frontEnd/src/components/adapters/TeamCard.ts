import { baseAPIUrl } from '../../paths';

export default class TeamCard {
  id: number;
  name: string;
  crestUrl: string;
  hasDefault: boolean;
  constructor(teamData: any) {
    this.id = teamData.id;
    this.name = teamData.name;
    this.crestUrl = teamData.hasCustomCrest ? `${baseAPIUrl}${teamData.crestUrl}` : teamData.crestUrl;
    this.hasDefault = teamData.hasDefault;
  }
}
