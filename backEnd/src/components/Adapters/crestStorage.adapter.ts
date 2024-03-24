import { readFile } from "../storage/dataStorage";
import { getUserCustomCrestFolderPath } from "../storage/userPath";

export default class CrestStorageAdapter {
    getCrest(username: string, filename: string): Buffer {
        const imgPath = `${getUserCustomCrestFolderPath(username)}/${filename}`;
        const file = readFile(imgPath);
        return file;
    }
}
