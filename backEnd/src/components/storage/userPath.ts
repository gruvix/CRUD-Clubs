/* eslint-disable max-len */
import { existsSync } from 'fs';
import { join } from 'path';
/**
 * @param {string} userId - ID of the user
 * @returns the path to the root folder of the user E.g. ROOT/src/userData/USERID
 */
export function getUserRootPath(userId: number) {
  const projectRoot = existsSync(
    join(__dirname, '..', 'userData', userId.toString()),
  )
    ? join(__dirname, '..')
    : process.cwd();
  const path = join(projectRoot, 'src', 'userData', userId.toString());
  return path;
}
export function getImageFromUserPath(userId: number, filename: string) {
  const userRoot = getUserRootPath(userId);
  const imageFilePath = userRoot.concat('/').concat(filename);
  return imageFilePath;
}
export function generateCustomCrestUrl(teamId: number, filename: string) {
  return `/user/customCrest/${teamId}/${filename}`;
}
