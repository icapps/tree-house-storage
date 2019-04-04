import * as S3 from 'aws-sdk/clients/s3';
import { BadRequestError } from 'tree-house-errors';
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
 * Upload a file to S3 storage
 * @param {Object} client existing s3 client
 * @param {Object} options s3 upload file options
 * @returns {Object} file response from aws
 */
export async function uploadFile(client: S3, options: IUploadS3Options): Promise<IUploadS3Result> {
  try {
    const fileStream = await readFile(options.path);

    const params: S3.PutObjectRequest = {
      Bucket: options.bucket,
      Key: options.key,
      Body: fileStream,
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

// Interfaces
export interface IClientS3Options {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface IUploadS3Options {
  path: string;
  contentType: string;
  bucket: string;
  key: string;
  encryption?: string;
}

export interface IUploadS3Result {
  url: string;
  bucket: string;
  key: string;
}

export interface IPresignedS3Options {
  bucket: string;
  key: string;
  expires?: number;
}
