# Treehouse storage

NodeJS storage utility module written in Typescript

[![npm version](https://badge.fury.io/js/tree-house-storage.svg)](https://badge.fury.io/js/tree-house-storage)
[![Dependencies](https://david-dm.org/icapps/tree-house-storage.svg)](https://david-dm.org/icapps/tree-house-storage.svg)
[![Build Status](https://travis-ci.org/icapps/tree-house-storage.svg?branch=master)](https://travis-ci.org/icapps/tree-house-storage)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-storage/badge.svg)](https://coveralls.io/github/icapps/tree-house-storage)

## Usage

## File-upload

### createMultipartUploader(options)

Create a multipart upload middleware

## Amazon

Amazon S3 wrapper methods

### createS3Client(clientOptions)

Creates an S3 client

### uploadFile(options, client)

Uploads a file to S3

### getObjectViaPresignedUrl(client, params)

Gets a pre-signed url for an S3 resource

## FileSystem

File system wrapper methods

### createFile(path, name, content)

Creates a file

### readFile(path)

Reads a file

### deleteFile(path)

Deletes a file 


## Tests

All tests are written using Jest. Check out the documentation [here](https://jestjs.io/docs/en/getting-started) for more information.

  You can run `npm run test` to run all tests

  You can run `npm run test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house-boilerplate/issues](https://github.com/icapps/tree-house-storage/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house-storage/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
