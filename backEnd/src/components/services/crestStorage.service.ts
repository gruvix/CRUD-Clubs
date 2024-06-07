import { Injectable } from '@nestjs/common';
import { createFolder, deleteFile, readFile } from '../storage/dataStorage';
import { getImageFromUserPath, getUserRootPath } from '../storage/userPath';

@Injectable()
export default class CrestStorageService {
  async getCrest(userId: number, filename: string): Promise<Buffer> {
    const imgPath = getImageFromUserPath(userId, filename);
    const file = await readFile(imgPath);
    return file;
  }
  async deleteCrest(userId: number, filename: string): Promise<void> {
    const imgPath = getImageFromUserPath(userId, filename);
    console.log('trying to delete image on path', imgPath);
    await deleteFile(imgPath);
  }
  async clearCrestFolder(userId: number): Promise<void> {
    const folderPath = `${getUserRootPath(userId)}`;
    await deleteFile(folderPath);
    await createFolder(folderPath);
  }
}
