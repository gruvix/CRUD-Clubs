class TeamListTeam {
  constructor(team, customCrest = false, isDefault = true, hasDefault = true) {
    this.name = team.name;
    this.id = team.id;
    this.crestUrl = team.crestUrl;
    this.hasCustomCrest = customCrest;
    this.isDefault = isDefault;
    this.hasDefault = hasDefault;
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
