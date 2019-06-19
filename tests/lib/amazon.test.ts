import * as fs from 'fs';
import * as httpStatus from 'http-status';
<<<<<<< HEAD
import { createClient, uploadFile, getPresignedUrl, resourceExists } from '../../src/lib/amazon';
import { BadRequestError } from '@icapps/tree-house-errors';
=======
import { createClient, uploadFile, getPresignedUrl, resourceExists, removeFile, getFile } from '../../src/lib/amazon';
import { BadRequestError } from 'tree-house-errors';
>>>>>>> 18a5714afdde12871f8439223886adafc05931e2
import { errors } from '../../src/config/error-config';
import { validateError, NUM_ERROR_CHECKS } from '../_helpers/util';

describe('amazon', () => {
  const s3PromiseMock = jest.fn();
  const result = 'https://secure-resourceurl.com';

  const mockMetaCallback = jest.fn();

  const awsClient = <any>{
    upload: jest.fn(() => ({ promise: s3PromiseMock })),
    getSignedUrl: jest.fn(() => (result)),
    headObject: mockMetaCallback,
    deleteObject: jest.fn(() => ({ promise: s3PromiseMock })),
    getObject: jest.fn(() => ({ promise: s3PromiseMock })),
  };

  afterEach(() => {
    s3PromiseMock.mockClear();
  });

  describe('createClient', () => {
    it('Should succesfully create an S3 client', () => {
      const client = createClient({
        region: 'belgium',
        accessKeyId: '1',
        secretAccessKey: 'secret',
      });

      expect(client.config).toMatchObject({
        accessKeyId: '1',
        region: 'belgium',
        secretAccessKey: 'secret',
      });
    });
  });

  describe('uploadFile', () => {
    beforeAll(() => {
      fs.writeFileSync('./uploadtest.txt', 'upload this pls', 'utf8');
    });

    afterAll(() => {
      fs.unlinkSync('./uploadtest.txt');
    });

    it('Should succesfully upload the file from path to Amazon S3 with encryption', async () => {
      s3PromiseMock.mockResolvedValueOnce({
        Location: 'http://s3.file.com',
        Bucket: 'bucket',
        Key: 'key',
      });

      await uploadFile(awsClient, {
        path: './uploadtest.txt',
        contentType: 'image/png',
        bucket: 'bucket',
        key: 'key',
        encryption: 'AE-256',
      });

      expect(s3PromiseMock).toBeCalledTimes(1);
    });

    it('Should succesfully upload the file from path to Amazon S3 without encryption', async () => {
      s3PromiseMock.mockResolvedValueOnce({
        Location: 'http://s3.file.com',
        Bucket: 'bucket',
        Key: 'key',
      });

      await uploadFile(awsClient, {
        path: './uploadtest.txt',
        contentType: 'image/png',
        bucket: 'bucket',
        key: 'key',
      });

      expect(s3PromiseMock).toBeCalledTimes(1);
    });

    it('Should succesfully upload the file content to Amazon S3 without encryption', async () => {
      s3PromiseMock.mockResolvedValueOnce({
        Location: 'http://s3.file.com',
        Bucket: 'bucket',
        Key: 'key',
      });

      await uploadFile(awsClient, {
        content: 'fileContent blabla',
        contentType: 'image/png',
        bucket: 'bucket',
        key: 'key',
      });

      expect(s3PromiseMock).toBeCalledTimes(1);
    });

    it('Should throw a custom error', async () => {
      s3PromiseMock.mockRejectedValueOnce(<any>Error('random error occured'));

      expect.assertions(NUM_ERROR_CHECKS);
      try {
        await uploadFile(awsClient, {
          path: './uploadtest.txt',
          contentType: 'image/png',
          bucket: 'bucket',
          key: 'key',
          encryption: 'AE-256',
        });
      } catch (error) {
        validateError(error, httpStatus.BAD_REQUEST, errors.FILE_UPLOAD_ERROR.code, 'random error occured');
      }
    });
  });

  describe('getPresignedUrl', () => {
    it('Should succesfully return the pre-signed url', async () => {
      const resourceUrl = await getPresignedUrl(awsClient, { bucket: 'bucket', key: 'key' });
      expect(resourceUrl).toEqual(result);
    });

    it('Should throw an error when something unexpected goes wrong', async () => {
      jest.spyOn(awsClient, 'getSignedUrl').mockRejectedValueOnce('error');
      try {
        await getPresignedUrl(awsClient, { bucket: 'bucket', key: 'key' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toEqual(errors.FILE_PRESIGNED_URL_ERROR.message);
      }
    });
  });

  describe('resourceExists', () => {
    it('Should return true when the resource exists', async () => {
      mockMetaCallback.mockImplementationOnce((_params, cb) => cb(null, 'data'));

      const result = await resourceExists(awsClient, { bucket: 'bucket', key: 'key' });
      expect(result).toEqual(true);
    });

    it('Should return false when the resource does not exist', async () => {
      mockMetaCallback.mockImplementationOnce((_params, cb) => cb(new Error('Error'), null));

      const result = await resourceExists(awsClient, { bucket: 'bucket', key: 'key' });
      expect(result).toEqual(false);
    });
  });

  describe('getFile', () => {
    it('Should get a file from AWS S3 succesfully', async () => {
      s3PromiseMock.mockResolvedValueOnce(<any>{
        AcceptRanges: 'bytes',
        ContentLength: 92090,
        ETag: '"afcfa009efd0f4324571f5b048ea9cee"',
        ContentType: 'application/pdf',
        Metadata: {},
        Body: new Buffer('myBufferContent', 'utf-8'),
      });

      await getFile(awsClient, 'com.icapps.inscribo', 'test');

      expect(s3PromiseMock).toHaveBeenCalledTimes(1);
    });

    it('Should throw error when AWS client throws an error', async () => {
      s3PromiseMock.mockRejectedValueOnce(new Error('S3 Error!'));
      expect.assertions(2);
      try {
        await getFile(awsClient, 'com.icapps.inscribo', 'test');
      } catch (error) {
        expect(s3PromiseMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('removeFile', () => {
    it('Should succesfully remove a file', async () => {
      await removeFile(awsClient, 'com.icapps.inscribo', 'test');

      expect(s3PromiseMock).toHaveBeenCalledTimes(1);
    });

    it('Should throw error when AWS client throws an error', async () => {
      s3PromiseMock.mockRejectedValueOnce(new Error('S3 Error!'));
      expect.assertions(2);
      try {
        await removeFile(awsClient, 'com.icapps.inscribo', 'test');
      } catch (error) {
        expect(s3PromiseMock).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
