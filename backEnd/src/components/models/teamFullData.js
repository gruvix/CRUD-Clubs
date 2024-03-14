const Team = require('./team.js');

class TeamFullData extends Team {
  constructor(data, isDefault, hasDefault) {
    super(data, isDefault, hasDefault);
    this.id = data.id;
    this.crestUrl = data.crestUrl;
    this.squad = data.squad;
    this.hasCustomCrest = data.hasCustomCrest;
    this.lastUpdated = data.lastUpdated;
  }
}

module.exports = TeamFullData;
