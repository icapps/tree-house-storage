import * as S3 from 'aws-sdk/clients/s3';
import { BadRequestError } from '@icapps/tree-house-errors';

import { errors } from '../config/error-config';
import { readFile } from './local';

/**
 * Create the S3 client
 * @param {Object} clientOptions
 * @returns {Object} amazon client instance
 */
export function createClient(clientOptions: IClientS3Options): S3 {
  const { region, accessKeyId, secretAccessKey } = clientOptions;
  return new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });
}

/**
 * Retrieve a file from S3
 * @param {Object} client
 * @param {String} bucket
 * @param {String} key
 * @returns {Object}
 */
export async function getFile(client: S3, bucket: string, key: string): Promise<IDownloadS3Result> {
  try {
    const params: S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };

    const result = await client.getObject(params).promise();
    return {
      body: result.Body,
    };
  } catch (error) {
    throw new BadRequestError(errors.FILE_DOWNLOAD_ERROR, { message: error.message });
  }
}

/**
 * Upload a file to S3 storage
 * @param {Object} client existing s3 client
 * @param {Object} options s3 upload file options
 * @returns {Object} file response from aws
 */
export async function uploadFile(client: S3, options: IUploadS3Options): Promise<IUploadS3Result> {
  try {
    let fileStream;
    if (options.path) fileStream = await readFile(options.path);

    const params: S3.PutObjectRequest = {
      Bucket: options.bucket,
      Key: options.key,
      Body: fileStream || options.content,
      ContentType: options.contentType,
    };

    // Optional encryption
    if (options.encryption) {
      params.ServerSideEncryption = options.encryption;
    }

    const result = await client.upload(params).promise();
    return {
      url: result.Location,
      bucket: result.Bucket,
      key: result.Key,
    };
  } catch (error) {
    throw new BadRequestError(errors.FILE_UPLOAD_ERROR, { message: error.message });
  }
}

/**
 * Remove a file from S3 storage
 * @param {Object} client
 * @param {String} bucket
 * @param {String} key
 * @returns {Object}
 */
export async function removeFile(client: S3, bucket: string, key: string): Promise<S3.DeleteObjectOutput> {
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    return await client.deleteObject(params).promise();
  } catch (error) {
    throw new BadRequestError(errors.FILE_REMOVE_ERROR, { message: error.message });
  }
}

/**
 * Get a pre-signed url
 * @param {Object} client existing s3 client
 * @param {Object} options s3 options
 * @returns {String} presigned url
 */
export async function getPresignedUrl(client: S3, options: IPresignedS3Options): Promise<string> {
  try {
    const params = {
      Bucket: options.bucket,
      Key: options.key,
      Expires: options.expires,
    };

    return await client.getSignedUrl('getObject', params);
  } catch (error) {
    throw new BadRequestError(errors.FILE_PRESIGNED_URL_ERROR, { message: error.message });
  }
}

/**
 * Post presigned url
 * @param {Object} client existing s3 client
 * @param {Object} options s3 options
 * @returns {String} presigned url
 */
export async function getUploadPresignedUrl(client: S3, options: IPresignedS3Options): Promise<string> {
  try {
    const params = {
      Bucket: options.bucket,
      Key: options.key,
      Expires: options.expires,
      ContentType: options.contentType,
    };

    return await client.getSignedUrl('putObject', params);
  } catch (error) {
    throw new BadRequestError(errors.FILE_PRESIGNED_URL_ERROR, { message: error.message });
  }
}
/**
 * Checks if the resource exists on the S3 bucket
 * @param {Object} client existing s3 client
 * @param {Object} options s3 options
 * @returns {boolean} resource exists or not
 */
export async function resourceExists(client: S3, params: { bucket: string; key: string }): Promise<boolean> {
  const { bucket, key } = params;
  return new Promise((resolve, _reject) => {
    client.headObject({ Bucket: bucket, Key: key }, (err, _data) => {
      if (err) return resolve(false);
      return resolve(true);
    });
  });
}

/**
 * Get the meta data of an S3 object
 * @param {Object} client existing s3 client
 * @param {Object} options s3 options
 * @returns {Object}
 */
export async function getMetaData(client: S3, params: { bucket: string; key: string }): Promise<S3.HeadObjectOutput> {
  const { bucket, key } = params;
  return new Promise((resolve, reject) => {
    client.headObject({ Bucket: bucket, Key: key }, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

// Interfaces
export interface IClientS3Options {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface IUploadS3Options {
  contentType: string;
  bucket: string;
  key: string;
  content?: string;
  encryption?: string;
  path?: string;
}

export interface IUploadS3Result {
  url: string;
  bucket: string;
  key: string;
}

export interface IDownloadS3Result {
  body: string | Buffer | Uint8Array | Blob | any;
}

export interface IPresignedS3Options {
  bucket: string;
  key: string;
  expires?: number;
  contentType?: string;
}
