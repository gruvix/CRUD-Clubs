const Team = require('./team');

class SquadTeam extends Team {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.squad = data.squad;
    this.crestUrl = data.crestUrl;
  }
}

module.exports = SquadTeam;
