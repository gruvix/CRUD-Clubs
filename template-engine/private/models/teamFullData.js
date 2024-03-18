const Team = require('./team.js');

class TeamFullData extends Team {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.crestUrl = data.crestUrl;
    this.squad = data.squad;
    this.hasCustomCrest = true;
    this.lastUpdated = data.lastUpdated;
  }
}

module.exports = TeamFullData;
