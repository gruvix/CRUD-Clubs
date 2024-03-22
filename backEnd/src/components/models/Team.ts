export interface TeamData {
  name: string;
  area: string | { name: string };
  address: string;
  phone: string | number;
  website: string;
  email: string;
  venue: string;
}

export default class Team {
  name: string;
  area: string;
  address: string;
  phone: string | number;
  website: string;
  email: string;
  venue: string;
  readonly hasDefault: boolean;
  constructor(
    data: TeamData,
    hasDefault = false
  ) {
    this.name = data.name;
    typeof data.area === "object"
      ? (this.area = data.area.name)
      : (this.area = data.area);
    this.address = data.address;
    this.phone = data.phone;
    this.website = data.website;
    this.email = data.email;
    this.venue = data.venue;
    this.hasDefault = hasDefault;
  }
}
