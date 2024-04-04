import { promises as fs } from 'fs';

export async function deleteFile(userPath: string): Promise<void> {
  try {
    await fs.rm(userPath, { recursive: true, force: true });
  } catch (err) {
    throw err;
  }
}
export async function copyFile(sourcePath: string, targetPath: string): Promise<void> {
  try {
    await fs.copyFile(sourcePath, targetPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`File not found: ${targetPath}`);
    } else {
      throw err;
    }
  }
}
export async function writeFile(targetPath: string, content: any): Promise<void> {
  try {
    await fs.writeFile(targetPath, content);
  } catch (err) {
    throw err;
  }
}
export async function readFile(targetPath: string): Promise<Buffer> {
  try {
    const content = await fs.readFile(targetPath);
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`File not found: ${targetPath}`);
    } else {
      throw err;
    }
  }
}
export async function readJSONFile(targetPath: string): Promise<JSON> {
  const content = JSON.parse(await fs.readFile(targetPath, 'utf-8'));
  return content;
}
export async function validateFile(filePath: string) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
export async function createFolder(folderPath: string): Promise<void> {
  try {
    await fs.access(folderPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(folderPath);
    } else {
      throw err;
    }
  }
}
