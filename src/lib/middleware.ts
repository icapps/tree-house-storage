import * as multer from 'multer';
import * as express from 'express';
import * as expressValidation from 'express-validation';
import { BadRequestError } from '@icapps/tree-house-errors';

import { errors } from '../config/error-config';

/**
 * Validate a Joi schema via express-validation
 * @param {any} schema
 * @param {Object} options
 */
export function validateSchema(schema: expressValidation.schema, options: expressValidation.EvOptions = {}) {
  return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    await expressValidation.validate(schema, options)(req, res, next);
  };
}

/**
 * Middleware function using multer with extra file filter options
 * @param {Object} options multipart options
 * @returns {Object} multer instance
 */
export function multipartUpload(options: MultipartOptions): multer.Multer {
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
export async function validateFile(
  req: express.Request,
  file: Express.Multer.File,
  next: IMulterFileFilterCb,
  options: MultipartOptions,
): Promise<void> {
  try {
    // Use validation middleware to check body schema
    if (options.validator) {
      await validateSchema(options.validator.schema, options.validator.options)(
        req,
        {} as express.Response,
        (error: any) => {
          if (error) throw error;
        },
      );
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
    schema: expressValidation.schema;
    options?: expressValidation.EvOptions;
  };
}
