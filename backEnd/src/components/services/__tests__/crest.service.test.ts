import { Test } from '@nestjs/testing';
import TeamService from '@comp/services/team.service';
import CrestService from '@comp/services/crest.service';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import { readFile } from 'fs/promises';
import CrestStorageService from '@comp/services/crestStorage.service';
import * as path from '@comp/storage/userPath';
import Team from '@comp/entities/team.entity';

describe('CrestController', () => {
  let teamService: TeamService;
  let crestService: CrestService;
  let crestStorageService: CrestStorageService;
  const userId = 1;
  const teamId = 1;
  const crestFileName = 'image.jpg';
  const oldCrestFileName = 'iAmOld';

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
    }).compile();
    teamService = module.get<TeamService>(TeamService);
    crestService = module.get<CrestService>(CrestService);
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });

  describe('getCrest', () => {
    it('should return a crest', async () => {
      const fixtureImagePath =
        './src/components/testing/__fixtures__/image.jpg';
      const imageFile = await readFile(fixtureImagePath);
      jest
        .spyOn(crestStorageService, 'getCrest')
        .mockResolvedValueOnce(imageFile);

      expect(await crestService.getCrest(userId, crestFileName)).toEqual(
        imageFile,
      );
      expect(crestStorageService.getCrest).toHaveBeenCalledWith(
        userId,
        crestFileName,
      );
    });

    it('should handle errors', async () => {
      jest
        .spyOn(crestStorageService, 'getCrest')
        .mockRejectedValueOnce(new Error("i'm an error"));

      await expect(
        crestService.getCrest(userId, crestFileName),
      ).rejects.toThrow(new Error("i'm an error"));
    });
  });

  describe('updateCrest', () => {
    it('should update the image of the team', async () => {
      const newCrestUrl = 'i/am/a/url';
      const relations = [] as string[];
      const selections = ['crestFileName', 'hasCustomCrest'];
      jest.spyOn(teamService, 'getTeam').mockResolvedValueOnce({
        id: teamId,
        crestFileName: oldCrestFileName,
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
        await crestService.updateCrest(userId, teamId, crestFileName),
      ).toEqual(newCrestUrl);

      expect(path.generateCustomCrestUrl).toHaveBeenCalledWith(
        teamId,
        crestFileName,
      );
      expect(teamService.getTeam).toHaveBeenCalledWith(
        teamId,
        relations,
        selections,
      );
      expect(teamService.updateTeam).toHaveBeenCalledWith(teamId, {
        id: teamId,
        crestUrl: newCrestUrl,
        crestFileName: crestFileName,
        hasCustomCrest: true,
      } as Team);
      expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
        userId,
        oldCrestFileName,
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
        crestService.updateCrest(userId, teamId, crestFileName),
      ).rejects.toThrow("i'm an error");
      expect(crestStorageService.deleteCrest).toHaveBeenCalledWith(
        userId,
        crestFileName,
      );
    });
  });
});
