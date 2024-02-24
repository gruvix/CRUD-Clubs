export default class Player {
  constructor(playerData) {
    this.id = playerData.id;
    this.name = playerData.name;
    this.position = playerData.position ? playerData.position : playerData.role;
    this.nationality = playerData.nationality;
  }
}