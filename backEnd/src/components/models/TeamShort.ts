class TeamShort {
  readonly id: number;
  name: string;
  crestUrl: string;
  hasCustomCrest: boolean;
  constructor(team: {
    id: number;
    name: string;
    crestUrl: string;
    hasCustomCrest: boolean;
  }) {
    this.id = team.id;
    this.name = team.name;
    this.crestUrl = team.crestUrl;
    this.hasCustomCrest = team.hasCustomCrest;
  }

  static properties = () => [
    'id',
    'name',
    'crestUrl',
    'hasCustomCrest',
  ];
}

export default TeamShort;
