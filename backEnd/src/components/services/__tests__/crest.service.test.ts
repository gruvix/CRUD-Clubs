import { Test } from '@nestjs/testing';
import TeamService from '@comp/services/team.service';
import CrestService from '@comp/services/crest.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import { readFile } from 'fs/promises';
import CrestStorageService from '@comp/services/crestStorage.service';
import * as path from '@comp/storage/userPath';
import Team from '@comp/entities/team.entity';
import MockTestUtils from '@comp/testing/MockTestUtils';

describe('CrestService', () => {
  let teamService: TeamService;
  let crestService: CrestService;
  let crestStorageService: CrestStorageService;

  const mocks = new MockTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
    }).compile();
    teamService = module.get<TeamService>(TeamService);
    crestService = module.get<CrestService>(CrestService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });

  describe('updateCrest', () => {
    it('should update the image of the team', async () => {
      const newCrestUrl = 'i/am/a/url';
      const relations = [] as string[];
      const selections = ['crestFileName', 'hasCustomCrest'];
      jest.spyOn(teamService, 'getTeam').mockResolvedValueOnce({
        id: mocks.teamId,
        crestFileName: mocks.oldCrestFileName,
        hasCustomCrest: true,
      } as Team);
      jest
        .spyOn(path, 'generateCustomCrestUrl')
        .mockImplementationOnce(() => newCrestUrl);
      jest.spyOn(teamService, 'updateTeam').mockResolvedValueOnce(void 0);
      jest
        .spyOn(crestStorageService, 'deleteCrest')
        .mockResolvedValueOnce(void 0);

      expect(
        await crestService.updateCrest(mocks.userId, mocks.teamId, mocks.crestFileName),
      ).toEqual(newCrestUrl);

      expect(path.generateCustomCrestUrl).toHaveBeenCalledWith(
        mocks.teamId,
        mocks.crestFileName,
      );
      expect(teamService.getTeam).toHaveBeenCalledWith(
        mocks.teamId,
        relations,
        selections,
      );
      expect(teamService.updateTeam).toHaveBeenCalledWith(mocks.teamId, {
        id: mocks.teamId,
        crestUrl: newCrestUrl,
        crestFileName: mocks.crestFileName,
        hasCustomCrest: true,
      } as Team);
      expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
        mocks.userId,
        mocks.oldCrestFileName,
      );
    });

    it('should delete the new image if there are errors', async () => {
      jest.spyOn(teamService, 'getTeam').mockImplementationOnce(() => {
        throw new Error("i'm an error");
      });
      jest
        .spyOn(crestStorageService, 'deleteCrest')
        .mockResolvedValueOnce(void 0);
      await expect(
        crestService.updateCrest(mocks.userId, mocks.teamId, mocks.crestFileName),
      ).rejects.toThrow("i'm an error");
      expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
        mocks.userId,
        mocks.crestFileName,
      );
    });
  });
});
