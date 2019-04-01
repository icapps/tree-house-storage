import { errors as defaults, ErrorType } from 'tree-house-errors';

const asType = <T extends { [key: string]: ErrorType }>(arg: T): T  => arg;

// tslint:disable:max-line-length
export const errors = asType({...defaults, ... {
  FILE_UPLOAD_ERROR:          { code: 'FILE_UPLOAD_ERROR', message: 'The selected file does not meet all requirements' },
  FILE_DOWNLOAD_ERROR:        { code: 'FILE_DOWNLOAD_ERROR', message: 'An error occurred trying to fetch the requested file' },
  FILE_READ_ERROR:            { code: 'FILE_READ_ERROR', message: 'The provided filepath did not result into a valid file' },
  FILE_REMOVE_ERROR:          { code: 'FILE_REMOVE_ERROR', message: 'An error occured trying to remove the given file' },
  FILE_PRESIGNED_URL_ERROR:   { code: 'FILE_PRESIGNED_URL_ERROR', message: 'An error occured trying to get a presigned url' },
}});
  // tslint:enable:max-line-length
