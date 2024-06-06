import { Inject, Injectable } from '@nestjs/common';
import CrestStorageAdapter from '@comp/Adapters/crestStorage.adapter';
import { generateCustomCrestUrl } from '@comp/storage/userPath';
import TeamService from './team.service';
import Team from '@comp/entities/team.entity';

const crestStorage = new CrestStorageAdapter();

@Injectable()
export default class CrestService {
  constructor(
    @Inject(TeamService)
    private readonly teamService: TeamService,
  ) {}
  async getCrest(userId: number, fileName: string): Promise<Buffer> {
    try{
      return await crestStorage.getCrest(userId, fileName);
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateCrest(
    userId: number,
    teamId: number,
    newImageFileName: string,
  ): Promise<string> {
    const oldCrestFileData = await this.teamService.getTeam(
      teamId,
      [],
      ['crestFileName', 'hasCustomCrest'],
    );
    try {
      const crestUrl = generateCustomCrestUrl(teamId, newImageFileName);
      let newData = new Team();
      newData.id = teamId;
      newData.crestUrl = crestUrl;
      newData.crestFileName = newImageFileName;
      newData.hasCustomCrest = true;

      await this.teamService.updateTeam(teamId, newData);
      await crestStorage.deleteCrest(userId, oldCrestFileData.crestFileName);
      return crestUrl;
    } catch (error) {
      await crestStorage.deleteCrest(userId, newImageFileName);
      throw new Error(error);
    }
  }
}
