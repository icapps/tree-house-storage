import * as httpMocks from 'node-mocks-http';
import * as httpStatus from 'http-status';
import * as Joi from 'joi';
import { multipartUpload, validateFile, MultipartOptions } from '../../src/lib/middleware';
import { validateError, NUM_ERROR_CHECKS } from '../_helpers/util';
import { errors } from '../../src/config/error-config';
import { ApiError } from 'tree-house-errors';

describe('middleware', () => {
  describe('multipartUpload', () => {
    // Mock data
    const request = httpMocks.createRequest({
      body: {
        name: 'random name',
      },
    });
    const file: Express.Multer.File = {
      fieldname: 'file', originalname: 'name', encoding: 'utf8',
      size: 80, destination: '/tmp', mimetype: 'application/xml', filename: 'test.xml',
      path: '/', buffer: <any> '',
    };

    it('Should succesfully create a multipart upload middleware', () => {
      const middleware = multipartUpload({
        destination: '/tmp',
        fileSize: 12000,
        allowedFileTypes: ['application/xml'],
      });

      expect(middleware).toHaveProperty('single');
      expect(middleware).toHaveProperty('fields');
      expect(middleware).toHaveProperty('array');
    });

    it('Should validate the file', async () => {
      const options: MultipartOptions = {
        fileSize: 100,
        destination: '/',
        allowedFileTypes: ['application/xml'],
      };

      validateFile(request, file, () => { }, options);
    });

    it('Should throw an error when the file type is not supported', () => {
      const options: MultipartOptions = {
        fileSize: 100,
        destination: '/',
        allowedFileTypes: ['image/png'],
      };

      expect.assertions(NUM_ERROR_CHECKS);

      const callbackFunction = (error: ApiError) => {
        validateError(error, httpStatus.BAD_REQUEST, errors.FILE_UPLOAD_ERROR.code, errors.FILE_UPLOAD_ERROR.message);
      };

      validateFile(request, file, callbackFunction, options);
    });

    it('Should validate the request body', () => {
      const options: MultipartOptions = {
        fileSize: 100,
        destination: '/',
        allowedFileTypes: ['application/xml'],
        validator: {
          schema: { body: { name: Joi.string().required() } },
        },
      };

      expect.assertions(1);
      const callbackFunction = (error: ApiError) => {
        expect(error).toEqual(null);
      };

      validateFile(request, file, callbackFunction, options);
    });

    it('Should throw an error when the request body is invalid', () => {
      const options: MultipartOptions = {
        fileSize: 100,
        destination: '/',
        allowedFileTypes: ['application/xml'],
        validator: {
          schema: { body: { anotherKey: Joi.string().required() } },
        },
      };

      expect.assertions(1);
      const callbackFunction = (error: any) => {
        expect(error.status).toEqual(httpStatus.BAD_REQUEST);
      };

      validateFile(request, file, callbackFunction, options);
    });
  });
});
