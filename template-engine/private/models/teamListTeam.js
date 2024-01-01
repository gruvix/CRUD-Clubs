class TeamListTeam {
  constructor(team) {
    this.name = team.name;
    this.id = team.id;
    this.crestUrl = team.crestUrl;
    this.isDefault = true;
    this.hasDefault = true;
    this.lastUpdated = team.lastUpdated;
  }
}

module.exports = TeamListTeam;
