class TeamShort {
  readonly id: number;
  name: string;
  crestUrl: string;
  defaultTeam: number;
  hasCustomCrest: boolean;
  constructor(team: {
    id: number;
    name: string;
    crestUrl: string;
    defaultTeam: number;
    hasCustomCrest: boolean;
  }) {
    this.id = team.id;
    this.name = team.name;
    this.crestUrl = team.crestUrl;
    this.defaultTeam = team.defaultTeam;
    this.hasCustomCrest = team.hasCustomCrest;
  }

  static properties = () => [
    'id',
    'name',
    'crestUrl',
    'defaultTeam',
    'hasCustomCrest',
  ];
}

export default TeamShort;
