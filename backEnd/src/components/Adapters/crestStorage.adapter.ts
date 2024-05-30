import { createFolder, deleteFile, readFile } from '../storage/dataStorage';
import { getUserRootPath } from '../storage/userPath';

export default class CrestStorageAdapter {
  async getCrest(userId: number, filename: string): Promise<Buffer> {
    const imgPath = `${getUserRootPath(userId)}/${filename}`;
    const file = await readFile(imgPath);
    return file;
  }
  async deleteCrest(userId: number, fileName: string): Promise<void> {
    const imgPath = `${getUserRootPath(userId)}/${fileName}`;
    console.log('trying to delete image on path', imgPath);
    await deleteFile(imgPath);
  }
  async clearCrestFolder(userId: number): Promise<void> {
    const folderPath = `${getUserRootPath(userId)}`;
    await deleteFile(folderPath);
    await createFolder(folderPath);
  }
}
