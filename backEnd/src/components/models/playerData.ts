export default class PlayerData {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  countryOfBirth: string;
  nationality: string;
  role: string;
  constructor(data: {id: number; name: string; position: string; dateOfBirth: string; countryOfBirth: string; nationality: string; role: string}) {
    this.id = data.id;
    this.name = data.name;
    this.position = data.position;
    this.dateOfBirth = data.dateOfBirth;
    this.countryOfBirth = data.countryOfBirth;
    this.nationality = data.nationality;
    this.role = data.role;
  }
}
