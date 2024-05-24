import PlayerDataOld from "./playerData.old";
import TeamOld, { TeamDataOld } from "./Team.old";

export default class TeamExtendedOld extends TeamOld {
  id: string | number;
  crestUrl: string;
  squad: PlayerDataOld[];
  hasCustomCrest: boolean;
  isDefault: boolean;
  lastUpdated: string;
  constructor(
    data: TeamDataOld & {
      readonly id: string | number;
      crestUrl: string;
      squad: PlayerDataOld[];
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
