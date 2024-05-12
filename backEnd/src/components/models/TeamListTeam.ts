class TeamListTeam {
  readonly id: number;
  name: string;
  crestUrl: string;
  hasCustomCrest: boolean;
  readonly isDefault: boolean;
  hasDefault: boolean;
  updatedAt: Date;
  constructor(
    team: {
      id: number;
      name: string;
      crestUrl: string;
      hasCustomCrest: boolean;
      hasDefault: boolean;
      updatedAt: Date;
    },
  ) {
    this.id = team.id;
    this.name = team.name;
    this.crestUrl = team.crestUrl;
    this.hasCustomCrest = team.hasCustomCrest;
    this.hasDefault = team.hasDefault;
    this.updatedAt = team.updatedAt;
  }

  static properties = () => [
    "name",
    "id",
    "crestUrl",
    "hasCustomCrest",
    "hasDefault",
    "updatedAt",
  ];
}

export default TeamListTeam;
