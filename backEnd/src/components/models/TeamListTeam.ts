class TeamListTeam {
  name: string;
  id: number;
  crestUrl: string;
  hasCustomCrest: boolean;
  isDefault: boolean;
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
    customCrest = false,
    isDefault = true,
    hasDefault = true
  ) {
    this.name = team.name;
    this.id = team.id;
    this.crestUrl = team.crestUrl;
    this.hasCustomCrest = customCrest;
    this.isDefault = isDefault;
    this.hasDefault = hasDefault;
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
