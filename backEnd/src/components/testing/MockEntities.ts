import Player from '@comp/entities/player.entity';
import Team from '@comp/entities/team.entity';
import User from '@comp/entities/user.entity';
import PlayerData from '@comp/interfaces/PlayerData.interface';
import TeamDTO from '@comp/interfaces/TeamDTO.interface';
import TeamData from '@comp/interfaces/TeamData.interface';
import TeamShort from '@comp/models/TeamShort';

export default class MockEntities {
  userId: number = 1;
  username: string = 'test';
  password: string = 'test';
  teamId: number = 1;
  playerId: number = 1;
  squadGenerator(teamId: number, playersAmount: number): Player[] {
    let squad = [];
    for (let i = 0; i < playersAmount; i++) {
      squad.push({
        id: i + 1,
        team: teamId,
        name: `test name ${i + 1}`,
        position: `test position ${i + 1}`,
        nationality: `test land ${i + 1}`,
        createdAt: undefined,
        updatedAt: undefined,
      });
    }
    return squad;
  }
  teamData(teamId: number = this.teamId, isDefault: boolean = true): TeamData {
    return JSON.parse(
      JSON.stringify({
        id: teamId,
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        hasCustomCrest: !isDefault,
        defaultTeam: isDefault ? teamId : undefined,
        squad: [] as Player[],
      }),
    );
  }
  playerDataWithId(): PlayerData {
    return JSON.parse(
      JSON.stringify({
        id: this.playerId,
        name: 'test name',
        position: 'test position',
        nationality: 'test land',
      }),
    );
  }
  playerDataWithoutId(): PlayerData {
    return JSON.parse(
      JSON.stringify({
        id: undefined,
        name: 'test name',
        position: 'test position',
        nationality: 'test land',
      }),
    );
  }
  
  user(userId: number = this.userId): User {
    return JSON.parse(
      JSON.stringify({
        id: userId,
        username: this.username,
        password: this.password,
        teams: [],
        createdAt: undefined,
        updatedAt: undefined,
      }),
    );
  }
  teamDTO(isDefault: boolean = true): TeamDTO {
    return JSON.parse(
      JSON.stringify({
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        hasCustomCrest: !isDefault,
        squad: [] as Player[],
        hasDefault: isDefault,
      }),
    );
  }
  team(
    teamId: number = this.teamId,
    userId: number = this.userId,
    isDefault: boolean = true,
  ): Team {
    return JSON.parse(
      JSON.stringify({
        id: teamId,
        user: userId,
        name: 'test',
        area: 'test',
        address: 'test',
        phone: 'test',
        website: 'test',
        email: 'test',
        venue: 'test',
        crestUrl: 'test',
        crestFileName: isDefault ? null : 'test',
        hasCustomCrest: !isDefault,
        squad: [],
        defaultTeam: isDefault ? teamId : undefined,
        createdAt: undefined,
        updatedAt: undefined,
      }),
    );
  }

  teamShort(teamId: number, isDefault: boolean = true): TeamShort {
    return new TeamShort({
      id: teamId,
      name: 'test',
      crestUrl: 'test',
      defaultTeam: isDefault ? teamId : undefined,
      hasCustomCrest: !isDefault,
    });
  }
}
