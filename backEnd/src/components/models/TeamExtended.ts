import Player from "./Player";
import Team, { TeamData } from "./Team";

export default class TeamExtended extends Team {
  id: string | number;
  crestUrl: string;
  squad: Player[];
  hasCustomCrest: boolean;
  isDefault: boolean;
  lastUpdated: string;
  constructor(
    data: TeamData & {
      readonly id: string | number;
      crestUrl: string;
      squad: Player[];
      hasCustomCrest: boolean;
      lastUpdated: string;
      isDefault: boolean;
      readonly hasDefault: boolean
    },
  ) {
    super(data, data.hasDefault);
    this.id = data.id;
    this.crestUrl = data.crestUrl;
    this.squad = data.squad;
    this.isDefault = data.isDefault;
    this.hasCustomCrest = data.hasCustomCrest;
    this.lastUpdated = data.lastUpdated;
  }
}
