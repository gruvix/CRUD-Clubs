import { baseAPIUrl } from '../../paths';
import Player from './Player';

export default class Team {
  other: {
    id: number;
    hasDefault: boolean;
    crestUrl: string;
    lastUpdated: string;
  };
  teamParameters: {
    name: string;
    area: string;
    address: string;
    phone: string | number;
    website: string;
    email: string;
    venue: string;
  };
  players: Player[];
  constructor(teamData: any) {
    this.other = {
      id: teamData.id,
      hasDefault: teamData.hasDefault,
      crestUrl: teamData.hasCustomCrest ? `${baseAPIUrl}${teamData.crestUrl}` : teamData.crestUrl,
      lastUpdated: teamData.lastUpdated,
    };
    this.teamParameters = {
      name: teamData.name,
      area: teamData.area,
      address: teamData.address,
      phone: teamData.phone,
      website: teamData.website,
      email: teamData.email,
      venue: teamData.venue,
    };
    if (!teamData.squad?.length) {
      this.players = [];
    } else {
      this.players = teamData.squad.map((player: string) => new Player(player));
    }
  }
}
export const teamParametersKeys = ['name', 'area', 'address', 'phone', 'website', 'email', 'venue'];
export interface TeamParameters {
  name: string;
  area: string;
  address: string;
  phone: string | number;
  website: string;
  email: string;
  venue: string;
  [key: string]: string | number;
}
