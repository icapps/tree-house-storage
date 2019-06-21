import * as middlewareService from './lib/middleware';
import * as localService from './lib/local';
import * as amazonService from './lib/amazon';
import * as S3 from 'aws-sdk/clients/s3';

export const middleware = middlewareService;
export const local = localService;
export const amazon = amazonService;

export { S3 };
