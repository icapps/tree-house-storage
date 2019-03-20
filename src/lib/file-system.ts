import * as fs from 'fs';
import { BadRequestError } from 'tree-house-errors';
import { errors } from '../config/error-config';

/**
 * Check if folder exists and create if not
 */
export function createIfNotExists(path: string) {
  if (!fs.existsSync(path)) return fs.mkdirSync(path);
}

/**
 * Create a new file
 */
export function createFile(path: string, name: string, content: any): string {
  createIfNotExists(path);
  fs.writeFileSync(`${path}/${name}`, content);
  return `${path}/${name}`;
}

/**
 * Return a readstream from a filepath
 */
export function readFile(path: string): Promise<fs.ReadStream> {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.R_OK, (err: Error) => {
      if (err) return reject(new BadRequestError(errors.FILE_READ_ERROR));
      return resolve(fs.createReadStream(path));
    });
  });
}

/**
 * Delete an existing file from a filepath
 */
export function deleteFile(path: string): void {
  try {
    return fs.unlinkSync(path);
  } catch (error) {
    throw new BadRequestError(errors.FILE_READ_ERROR);
  }
}
