import { Inject, Injectable } from '@nestjs/common';
import CrestStorageService from '@comp/services/crestStorage.service';
import { generateCustomCrestUrl } from '@comp/storage/userPath';
import TeamService from './team.service';
import Team from '@comp/entities/team.entity';

@Injectable()
export default class CrestService {
  constructor(
    @Inject(TeamService)
    private readonly teamService: TeamService,
    @Inject(CrestStorageService)
    private readonly crestStorageService: CrestStorageService,
  ) {}
  async updateCrest(
    userId: number,
    teamId: number,
    newImageFileName: string,
  ): Promise<string> {
    try {
      const oldCrestFileData = await this.teamService.getTeam(
        teamId,
        [],
        ['crestFileName', 'hasCustomCrest'],
      );
      const crestUrl = generateCustomCrestUrl(teamId, newImageFileName);
      let newData = new Team();
      newData.id = teamId;
      newData.crestUrl = crestUrl;
      newData.crestFileName = newImageFileName;
      newData.hasCustomCrest = true;

      await this.teamService.updateTeam(teamId, newData);
      await this.crestStorageService.deleteCrest(
        userId,
        oldCrestFileData.crestFileName,
      );
      return crestUrl;
    } catch (error) {
      await this.crestStorageService.deleteCrest(userId, newImageFileName);
      throw new Error(error);
    }
  }
}
