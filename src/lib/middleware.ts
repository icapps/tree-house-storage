import * as multer from 'multer';
import * as expressValidation from 'express-validation';
import { BadRequestError } from '@icapps/tree-house-errors';

import { errors } from '../config/error-config';

/**
 * Validate a Joi schema via express-validation
 */
export function validateSchema(schema: any, options = {}) {
  return function (req: Express.Request, res: Express.Response | any, next: Function) {
    const allOptions = {
      allowUnknownBody: false,
      allowUnknownParams: false,
      ...options,
    };

    expressValidation.options(allOptions);
    expressValidation(schema)(req, res, next);
  };
}

/**
 * Middleware function using multer with extra file filter options
 * @param {Object} options multipart options
 * @returns {Object} multer instance
 */
export function multipartUpload(options: MultipartOptions): multer.Instance {
  return multer({
    dest: options.destination,
    limits: {
      fileSize: options.fileSize,
    },
    fileFilter: (req, file, next) => validateFile(req, file, next, options),
  });
}

/**
 * Function to validate the incoming file
 * @param {Object} req - Express request
 * @param {Object} file - Express Multer File
 * @callback multerFileFiltercb
 * @param options- multipart options
 */
export function validateFile(req: Express.Request, file: Express.Multer.File, next: IMulterFileFilterCb, options: MultipartOptions): void {
  try {
    // Use validation middleware to check body schema
    if (options.validator) {
      validateSchema(options.validator.schema, options.validator.options)(req, {}, (error: Error) => {
        if (error) throw error;
      });
    }

    if (!options.allowedFileTypes.includes(file.mimetype)) throw new BadRequestError(errors.FILE_UPLOAD_ERROR);
    next(null, true);
  } catch (error) {
    return next(error, false);
  }
}

// Interfaces
type IMulterFileFilterCb = (error: Error | null, acceptFile: boolean) => void;

export interface MultipartOptions {
  destination: string;
  fileSize: number;
  allowedFileTypes: string[];
  validator?: {
    schema: any;
    options?: any;
  };
}
