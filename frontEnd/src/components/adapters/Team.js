import { BASE_API_URL } from '../../paths';
import Player from './Player';

export default class Team {
  constructor(teamData) {
    this.other = {
      id: teamData.id,
      hasDefault: teamData.hasDefault,
      crestUrl: teamData.hasCustomCrest ? `${BASE_API_URL}${teamData.crestUrl}` : teamData.crestUrl,
      lastUpdated: teamData.lastUpdated,
    };
    this.teamParameters = {
      name: teamData.name,
      area: typeof teamData.area === 'object' ? teamData.area.name : teamData.area,
      address: teamData.address,
      phone: teamData.phone,
      website: teamData.website,
      email: teamData.email,
      venue: teamData.venue,
    };
    if (!teamData.squad?.length) {
      this.players = [];
    } else {
      this.players = teamData.squad.map((player) => new Player(player));
    }
  }
}
export const teamParametersKeys = ['name', 'area', 'address', 'phone', 'website', 'email', 'venue'];
