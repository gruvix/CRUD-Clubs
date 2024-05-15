export default class TeamData {
  name: string;
  area: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  venue: string;
  readonly defaultTeam: number;
  constructor(data: TeamData) {
    this.name = data.name;
    this.area = data.area;
    this.address = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.venue = data.venue;
    this.defaultTeam = data.defaultTeam;
  }
}
