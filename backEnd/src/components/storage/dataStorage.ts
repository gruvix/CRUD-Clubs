import * as fsPromises from 'fs/promises';
import FileNotFoundError from '../errors/fileNotFoundError';

export async function deleteFile(userPath: string): Promise<void> {
  try {
    await fsPromises.rm(userPath, { recursive: true, force: true });
  } catch (err) {
    throw err;
  }
}
export async function copyFile(
  sourcePath: string,
  targetPath: string,
): Promise<void> {
  try {
    await fsPromises.copyFile(sourcePath, targetPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new FileNotFoundError(`File not found: ${targetPath}`);
    } else {
      throw err;
    }
  }
}
export async function writeFile(
  targetPath: string,
  content: any,
): Promise<void> {
  try {
    await fsPromises.writeFile(targetPath, content);
  } catch (err) {
    throw err;
  }
}
export async function readFile(targetPath: string): Promise<Buffer> {
  try {
    const content = await fsPromises.readFile(targetPath);
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new FileNotFoundError(`File not found: ${targetPath}`);
    } else {
      throw err;
    }
  }
}
export async function readJSONFile(targetPath: string): Promise<any> {
  try {
    const jsonContent = await fsPromises.readFile(targetPath, 'utf-8');
    const content = JSON.parse(jsonContent);
    return content;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new FileNotFoundError(`File not found: ${targetPath}`);
    } else {
      throw err;
    }
  }
}
export async function validateFile(filePath: string): Promise<boolean> {
  try {
    await fsPromises.access(filePath, fsPromises.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
export async function createFolder(folderPath: string): Promise<void> {
  try {
    await fsPromises.access(folderPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fsPromises.mkdir(folderPath, { recursive: true });
      } catch (subErr) {
        throw subErr;
      }
    } else {
      throw err;
    }
  }
}
