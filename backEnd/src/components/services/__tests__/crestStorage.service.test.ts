import { Test } from '@nestjs/testing';
import { TestSetupModule } from '@comp/testing/testSetup.module';
import * as dataStorage from '@comp/storage/dataStorage';
import CrestStorageService from '@comp/services/crestStorage.service';
import * as path from '@comp/storage/userPath';
import MockTestUtils from '@comp/testing/MockTestUtils';
import PathTestUtils from '@comp/testing/PathTestUtils';

describe('CrestController', () => {
  let crestStorageService: CrestStorageService;

  const mocks = new MockTestUtils();
  const paths = new PathTestUtils();

  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestSetupModule],
    }).compile();
    crestStorageService = module.get<CrestStorageService>(CrestStorageService);
  });
  describe('getCrest', () => {
    it('should return image', async () => {
      jest
        .spyOn(path, 'getUserImagePath')
        .mockImplementationOnce(() => mocks.imageFilePath);
      const image = await dataStorage.readFile(paths.fixtureImagePath);
      jest.spyOn(dataStorage, 'readFile').mockResolvedValueOnce(image);
      expect(
        await crestStorageService.getCrest(mocks.userId, mocks.crestFileName),
      ).toEqual(image);
      expect(path.getUserImagePath).toHaveBeenCalledWith(
        mocks.userId,
        mocks.crestFileName,
      );
      expect(dataStorage.readFile).toHaveBeenCalledWith(mocks.imageFilePath);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(path, 'getUserImagePath')
        .mockImplementationOnce(() => mocks.imageFilePath);
      jest
        .spyOn(dataStorage, 'readFile')
        .mockRejectedValueOnce(new Error("i'm an error"));
      await expect(
        crestStorageService.getCrest(mocks.userId, mocks.crestFileName),
      ).rejects.toThrow(new Error("i'm an error"));

      jest.spyOn(path, 'getUserImagePath').mockImplementationOnce(() => {
        throw new Error("I'm another error");
      });

      await expect(
        crestStorageService.getCrest(mocks.userId, mocks.crestFileName),
      ).rejects.toThrow(new Error("I'm another error"));
    });
  });

  describe('deleteCrest', () => {
    it('should delete a file on a specific path', async () => {
      jest
        .spyOn(path, 'getUserImagePath')
        .mockImplementationOnce(() => mocks.imageFilePath);
      jest.spyOn(dataStorage, 'deleteFile').mockResolvedValueOnce(void 0);

      expect(
        crestStorageService.deleteCrest(mocks.userId, mocks.crestFileName),
      ).resolves.toEqual(void 0);
      expect(path.getUserImagePath).toHaveBeenCalledWith(
        mocks.userId,
        mocks.crestFileName,
      );
      expect(dataStorage.deleteFile).toHaveBeenCalledWith(mocks.imageFilePath);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(path, 'getUserImagePath')
        .mockImplementationOnce(() => mocks.imageFilePath);
      jest
        .spyOn(dataStorage, 'deleteFile')
        .mockRejectedValueOnce(new Error("i'm an error"));
      await expect(
        crestStorageService.deleteCrest(mocks.userId, mocks.crestFileName),
      ).rejects.toThrow(new Error("i'm an error"));
      expect(path.getUserImagePath).toHaveBeenCalledWith(
        mocks.userId,
        mocks.crestFileName,
      );
      expect(dataStorage.deleteFile).toHaveBeenCalledWith(mocks.imageFilePath);
    });
  });

  describe('clearCrestFolder', () => {
    it('should delete and re-create the same folder', async () => {
      jest
        .spyOn(path, 'getUserRootPath')
        .mockImplementationOnce(() => mocks.userRootPath);
      jest.spyOn(dataStorage, 'deleteFile').mockResolvedValueOnce(void 0);
      jest.spyOn(dataStorage, 'createFolder').mockResolvedValueOnce(void 0);

      await expect(
        crestStorageService.clearCrestFolder(mocks.userId),
      ).resolves.toEqual(void 0);
      expect(path.getUserRootPath).toHaveBeenCalledWith(mocks.userId);
      expect(dataStorage.deleteFile).toHaveBeenCalledWith(mocks.userRootPath);
      expect(dataStorage.createFolder).toHaveBeenCalledWith(mocks.userRootPath);
    });

    it('should handle errors', async () => {
      jest.spyOn(path, 'getUserRootPath').mockImplementationOnce(() => {
        throw new Error("i'm an error");
      });
      await expect(
        crestStorageService.clearCrestFolder(mocks.userId),
      ).rejects.toThrow(new Error("i'm an error"));
      expect(path.getUserRootPath).toHaveBeenCalledWith(mocks.userId);
      expect(dataStorage.deleteFile).not.toHaveBeenCalled();
      expect(dataStorage.createFolder).not.toHaveBeenCalled();
    });
  });
});
