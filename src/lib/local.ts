import * as fs from 'fs';
import { BadRequestError } from 'tree-house-errors';
import { errors } from '../config/error-config';

export function exists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.exists(path, found => found ? resolve(true) : resolve(false));
  });
}

/**
 * Check if folder exists and create if not
 * @param {String} path filepath
 */
export async function createIfNotExists(path: string) {
  const existingPath = await exists(path);

  return new Promise((resolve, reject) => {
    if (!existingPath) {
      return fs.mkdir(path, error => error ? reject(error) : resolve());
    }
    resolve();
  });
}

/**
 * Create a new file
 * @param {String} path filepath
 * @param {String} name filename
 * @param {Any} content file content
 * @returns {String} path where the file is stored
 */
export async function createFile(path: string, name: string, content: any): Promise<string> {
  await createIfNotExists(path);

  return new Promise((resolve, reject) => {
    fs.writeFile(`${path}/${name}`, content, (error) => {
      return error ? reject(error) : resolve(`${path}/${name}`);
    });
  });
}

/**
 * Return a readstream from a filepath
 * @param {String} path filepath
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
 * @param {String} path filepath
 */
export function deleteFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      return error ? reject(new BadRequestError(errors.FILE_READ_ERROR)) : resolve();
    });
  });
}
