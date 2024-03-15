export default class Player {
  [key: string]: string | number;
  constructor(data: { [key: string]: string | number }) {
    this.id = data.id;
    this.name = data.name;
    this.position = data.position;
    this.dateOfBirth = data.dateOfBirth;
    this.countryOfBirth = data.countryOfBirth;
    this.nationality = data.nationality;
    this.role = data.role;
  }
}
