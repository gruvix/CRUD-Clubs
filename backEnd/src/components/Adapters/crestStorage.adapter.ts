import { deleteFile, readFile } from '../storage/dataStorage';
import { getUserRootPath } from '../storage/userPath';

export default class CrestStorageAdapter {
  async getCrest(username: string, filename: string): Promise<Buffer> {
    const imgPath = `${getUserRootPath(username)}/${filename}`;
    const file = await readFile(imgPath);
    return file;
  }
  async deleteCrest(username: string, fileName: string) {
    const imgPath = `${getUserRootPath(username)}/${fileName}`;
    await deleteFile(imgPath);
  }
  async clearCrestFolder(userId: number): Promise<void> {
    const folderPath = `${getUserRootPath(userId)}`;
    await deleteFile(folderPath);
    await createFolder(folderPath);
  }
}
