export default class Team {
  constructor(teamData) {
    this.private = {
      id: teamData.id,
      crestUrl: teamData.crestUrl,
      hasCustomCrest: teamData.hasCustomCrest,
      lastUpdated: teamData.lastUpdated,
      auth: teamData.auth,
    };
    this.public = {
      name: teamData.name,
      area: typeof teamData.area === 'object' ? teamData.area.name : teamData.area,
      address: teamData.address,
      phone: teamData.phone,
      website: teamData.website,
      email: teamData.email,
      venue: teamData.venue,
    };
    this.squad = teamData.squad;
  }
}
