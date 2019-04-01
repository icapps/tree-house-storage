import * as multer from 'multer';
import { validateSchema } from 'tree-house';
import { BadRequestError } from 'tree-house-errors';
import { errors } from '../config/error-config';

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
    fileFilter: (req: any, file, next) => {
      // Use validation middleware to check body schema
      if (options.validator) {
        validateSchema(options.validator.schema, options.validator.options)(req, {}, (error: Error) => {
          if (error) return next(error, false);
        });
      }

      if (!options.allowedFileTypes.includes(file.mimetype)) return next(new BadRequestError(errors.FILE_UPLOAD_ERROR), false);
      next(null, true);
    },
  });
}

// Interfaces
export interface MultipartOptions {
  destination: string;
  fileSize: number;
  allowedFileTypes: string[];
  validator?: {
    schema: any;
    options?: any;
  };
}
