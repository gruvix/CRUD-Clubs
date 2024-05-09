export interface TeamDataOld {
  name: string;
  area: string | { name: string };
  address: string;
  phone: string | number;
  website: string;
  email: string;
  venue: string;
}

export default class TeamOld {
  name: string;
  area: string;
  address: string;
  phone: string | number;
  website: string;
  email: string;
  venue: string;
  readonly hasDefault: boolean;
  constructor(
    data: TeamDataOld,
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
