import Player from "./Player.js";
import Team, { TeamData } from "./Team.js";

export default class TeamExtended extends Team {
  id: string | number;
  crestUrl: string;
  squad: Player[];
  hasCustomCrest: boolean;
  lastUpdated: string;
  constructor(
    data: TeamData & {
      readonly id: string | number;
      crestUrl: string;
      squad: Player[];
      hasCustomCrest: boolean;
      lastUpdated: string;
      isDefault: boolean,
      readonly hasDefault: boolean
    },
  ) {
    super(data, data.hasDefault);
    this.id = data.id;
    this.crestUrl = data.crestUrl;
    this.squad = data.squad;
    this.hasCustomCrest = data.hasCustomCrest;
    this.lastUpdated = data.lastUpdated;
  }
}
