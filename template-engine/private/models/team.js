class Team {
  constructor(data) {
    this.name = data.name;
    this.area = data.area.name;
    this.address = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.venue = data.venue;
  }
}

module.exports = Team;
