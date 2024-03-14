class Team {
  constructor(data, isDefault = false, hasDefault = false) {
    this.name = data.name;
    if (isDefault) {
      this.area = data.area.name;
    } else {
      this.area = data.area;
    }
    this.address = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.venue = data.venue;
    this.hasDefault = hasDefault;
  }
}

module.exports = Team;
