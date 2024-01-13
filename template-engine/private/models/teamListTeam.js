class TeamListTeam {
  constructor(team) {
    this.name = team.name;
    this.id = team.id;
    this.crestUrl = team.crestUrl;
    this.hasCustomCrest = false;
    this.isDefault = true;
    this.hasDefault = true;
    this.lastUpdated = team.lastUpdated;
  }

  static properties = () => [
    'name',
    'id',
    'crestUrl',
    'hasCustomCrest',
    'isDefault',
    'hasDefault',
    'lastUpdated',
  ];
}

module.exports = TeamListTeam;
