import * as fs from "fs";

export function deleteFile(userPath: string) {
  fs.rmSync(userPath, { recursive: true, force: true });
}
export function copyFile(sourcePath: string, targetPath: string) {
  fs.copyFileSync(sourcePath, targetPath);
}
export function writeFile(targetPath: string, content: any) {
  fs.writeFileSync(targetPath, content);
}
/**
 * @returns - JSON object
 */
export function readFile(targetPath: string) {
  try {
    const content = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
    return content;
  } catch (err) {
    throw err;
  }
}
export function validateFile(filePath: string) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
export function createFolder(folderPath: string) {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  } catch (err) {
    throw err;
  }
}
