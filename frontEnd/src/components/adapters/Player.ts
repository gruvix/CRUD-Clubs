export default class Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  [key: string]: string | number;
  
  constructor(playerData: any) {
    this.id = playerData.id;
    this.name = playerData.name;
    this.position = playerData.position ? playerData.position : playerData.role;
    this.nationality = playerData.nationality;
  }
}
export const playerKeys = ['name', 'position', 'nationality']; // id is not included as it is a hidden value
