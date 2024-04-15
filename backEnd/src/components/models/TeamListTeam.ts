class TeamListTeam {
  name: string;
  id: number;
  crestUrl: string;
  hasCustomCrest: boolean;
  readonly isDefault: boolean;
  hasDefault: boolean;
  lastUpdated: string;
  constructor(
    team: {
      name: string;
      id: number;
      crestUrl: string;
      hasCustomCrest: boolean;
      isDefault: boolean;
      hasDefault: boolean;
      lastUpdated: string;
    },
  ) {
    this.name = team.name;
    this.id = team.id;
    this.crestUrl = team.crestUrl;
    this.hasCustomCrest = team.hasCustomCrest;
    this.isDefault = team.isDefault;
    this.hasDefault = team.hasDefault;
    this.lastUpdated = team.lastUpdated;
  }

  static properties = () => [
    "name",
    "id",
    "crestUrl",
    "hasCustomCrest",
    "hasDefault",
    "lastUpdated",
  ];
}

export default TeamListTeam;
