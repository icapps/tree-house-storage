import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { readFile } from './file-system';
import { BadRequestError } from 'tree-house-errors';
import { errors } from '../config/error-config';

/**
 * Create the S3 client
 */
export function createS3Client(clientOptions: ClientOptions): AWS.S3 {
  const { region, accessKeyId, secretAccessKey } = clientOptions;
  return new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });
}

/**
 * Upload a file to S3 storage
 */
export async function uploadFile(options: UploadFileOptions, client: FileClient): Promise<S3.ManagedUpload.SendData> {
  try {
    const fileStream = await readFile(options.path);

    const params: S3.PutObjectRequest = {
      ...(options.ServerSideEncryption && { ServerSideEncryption: options.ServerSideEncryption }),
      Bucket: options.bucket,
      Key: options.key,
      Body: fileStream,
      ContentType: options.contentType,
    };

    return await client.upload(params).promise();
  } catch (error) {
    throw new BadRequestError(errors.FILE_UPLOAD_ERROR, { message: error.message });
  }
}

/**
 * Get a pre-signed url
 */
export async function getObjectViaPresignedUrl(client: AWS.S3, params: {Bucket: string, Key: string, Expires?: number}): Promise<any> {
  try {
    console.log(client);
    return await client.getSignedUrl('getObject', params);
  } catch (error) {
    throw new Error('Error in get object via presigned url');
  }
}

// Interfaces
export interface UploadFileOptions {
  path: string;
  name: string;
  contentType: string;
  bucket: string;
  key: string;
  ServerSideEncryption?: string;
}

export interface FileClient {
  upload: (params: S3.Types.PutObjectRequest) => ({
    promise: () => Promise<S3.ManagedUpload.SendData>,
  });
  getObject: (params: S3.Types.GetObjectRequest) => ({
    promise: () => Promise<S3.Types.GetObjectOutput>,
  });
  deleteObject: (params: S3.Types.DeleteObjectRequest) => ({
    promise: () => Promise<S3.DeleteObjectOutput>,
  });
}

export interface ClientOptions {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}
