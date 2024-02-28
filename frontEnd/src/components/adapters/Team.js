import Player from './Player';

export default class Team {
  constructor(teamData) {
    this.other = {
      id: teamData.id,
      crestUrl: teamData.crestUrl,
      hasCustomCrest: teamData.hasCustomCrest,
      hasDefault: teamData.hasDefault,
      auth: teamData.auth,
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
    this.players = teamData.squad.map((player) => new Player(player));
  }
}
export const teamParametersKeys = ['name', 'area', 'address', 'phone', 'website', 'email', 'venue'];
