# Treehouse storage

NodeJS storage utility module written in Typescript

[![npm version](https://badge.fury.io/js/tree-house-storage.svg)](https://badge.fury.io/js/tree-house-storage)
[![Dependencies](https://david-dm.org/icapps/tree-house-storage.svg)](https://david-dm.org/icapps/tree-house-storage.svg)
[![Build Status](https://travis-ci.org/icapps/tree-house-storage.svg?branch=master)](https://travis-ci.org/icapps/tree-house-storage)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-storage/badge.svg)](https://coveralls.io/github/icapps/tree-house-storage)

## Installation

Install via npm

```shell
npm install tree-house-storage
```

or via yarn

```shell
yarn add tree-house-storage
```

## Usage

## Middleware functions

### multipartUpload(options)

Express middleware function to upload a local file using multer.

```javascript
import { middleware } from 'tree-house-storage'

const options = {
  destination: 'uploads',
  fileSize: 12000,
  allowedFileTypes: ['image/png', 'image/jpg'],
  
  // Optional Joi schema validation for other body data
  validator: {
    schema: joiSchema,
    options: joiOptions,
  };
};

app.post('/upload', middleware.multipartUpload(options), ...);
```

[More information on Multer](https://github.com/expressjs/multer)

## Local filesystem

Local file functions enabling the use of Promises for `fs` methods.

[More information on fs](https://nodejs.org/api/fs.html)

### createFile(path, name, content)

Creates a new local file. This will also create a folder when it does not exist already. (*Synchronous*)

```javascript
import { local } from 'tree-house-storage'
local.createFile('/localFolder', 'myFile.txt', 'My personal content');
```

### readFile(path)

Read an existing local file via filepath. (*Asynchronous*)

```javascript
import { local } from 'tree-house-storage'
await local.readFile('/localFolder', 'myFile.txt', 'My personal content');
```

### deleteFile(path)

Delete an existing local file via filepath (*Synchronous*)

```javascript
import { local } from 'tree-house-storage'
await local.deleteFile('/localFolder/myFile.txt');
```

## Amazon

Amazon S3 libs

[More information on AWS S3](https://aws.amazon.com/sdk-for-node-js/)

### createClient(clientOptions)

Create an S3 client

```javascript
import { amazon } from 'tree-house-storage'

const options = {
  region: 'eu-west-1',
  accessKeyId: 'myAccesKey',
  secretAccessKey: 'mySecret',
};
const client = amazon.createClient(options);
```

### uploadFile(client, options)

Upload a file to S3

```javascript
import { amazon } from 'tree-house-storage'

const options = {
  path: 'localPath/localFile.png',
  name: uuid.v4(),
  contentType: 'image/png',
  bucket: 's3bucketName',
  key: 's3KeyName',
  encryption: 'AE-256', // Optional encryption (this will enable server encryption on S3)
};
const { location, bucket, key } = amazon.uploadFile(client, options);
```

### getPresignedUrl(client, options)

Gets a pre-signed url for an S3 resource

```javascript
import { amazon } from 'tree-house-storage'

const options = {
  bucket: 's3bucketName',
  key: 's3KeyName',
  expires: 1600, // Optional expiration time
};
const { location, bucket, key } = amazon.getPresignedUrl(client, options);
```

## Tests

All tests are written using Jest. Check out the documentation [here](https://jestjs.io/docs/en/getting-started) for more information.

  You can run `npm run test` to run all tests

  You can run `npm run test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house-storage/issues](https://github.com/icapps/tree-house-storage/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house-storage/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
