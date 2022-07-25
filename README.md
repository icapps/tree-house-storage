# Treehouse storage

NodeJS storage utility module written in Typescript

[![npm version](https://badge.fury.io/js/%40icapps%2Ftree-house-storage.svg)](https://badge.fury.io/js/%40icapps%2Ftree-house-storage)
[![Dependencies](https://david-dm.org/icapps/tree-house-storage.svg)](https://david-dm.org/icapps/tree-house-storage.svg)
[![Build Status](https://travis-ci.com/icapps/tree-house-storage.svg?branch=master)](https://travis-ci.com/icapps/tree-house-storage)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-storage/badge.svg)](https://coveralls.io/github/icapps/tree-house-storage) [![Greenkeeper badge](https://badges.greenkeeper.io/icapps/tree-house-storage.svg)](https://greenkeeper.io/)

## Installation

Install via npm

```shell
npm install @icapps/tree-house-storage
```

or via yarn

```shell
yarn add @icapps/tree-house-storage
```

## Usage

## Middleware functions

### multipartUpload(options)

Express middleware function to upload a local file using multer.

```javascript
import { middleware } from '@icapps/tree-house-storage'

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

### createIfNotExists(path)

Creates a folder if it doesn't exist already. (*Asynchronous*)

```javascript
import { local } from '@icapps/tree-house-storage'
await local.createIfNotExists('/localFolder');
```

### createFile(path, name, content)

Creates a new local file. This will also create a folder when it does not exist already. (*Asynchronous*)

```javascript
import { local } from '@icapps/tree-house-storage'
await local.createFile('/localFolder', 'myFile.txt', 'My personal content');
```

### readFile(path)

Read an existing local file via filepath. (*Asynchronous*)

```javascript
import { local } from '@icapps/tree-house-storage'
await local.readFile('/localFolder', 'myFile.txt', 'My personal content');
```

### deleteFile(path)

Delete an existing local file via filepath (*Asynchronous*)

```javascript
import { local } from '@icapps/tree-house-storage'
await local.deleteFile('/localFolder/myFile.txt');
```

## Amazon

Amazon S3 libs

[More information on AWS S3](https://aws.amazon.com/sdk-for-node-js/)

### createClient(clientOptions)

Create an S3 client

```javascript
import { amazon } from '@icapps/tree-house-storage'

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
import { amazon } from '@icapps/tree-house-storage'

const options = {
  path: 'localPath/localFile.png',
  content: 'fileContent ...',
  name: uuid.v4(),
  contentType: 'image/png',
  bucket: 's3bucketName',
  key: 's3KeyName',
  encryption: 'AE-256', // Optional encryption (this will enable server encryption on S3)
};
const { location, bucket, key } = await amazon.uploadFile(client, options);
```

### getFile(client, bucket, key)

Retrieve a file from S3

```javascript
import { amazon } from '@icapps/tree-house-storage'

const { body } = await amazon.getFile(client, bucket, key);
```

### removeFile(client, bucket, key)

Remove a file from S3

```javascript
import { amazon } from '@icapps/tree-house-storage'

await amazon.removeFile(client, bucket, key);
```

### getPresignedUrl(client, options)

Gets a pre-signed url for an S3 resource

```javascript
import { amazon } from '@icapps/tree-house-storage'

const options = {
  bucket: 's3bucketName',
  key: 's3KeyName',
  expires: 1600, // Optional expiration time
};
const { location, bucket, key } = await amazon.getPresignedUrl(client, options);
```

### getUploadPresignedUrl(client, options)

Gets a pre-signed upload url for an S3 resource

```javascript
import { amazon } from '@icapps/tree-house-storage'

const options = {
  bucket: 's3bucketName',
  key: 's3KeyName',
  expires: 1600, // Optional expiration time
  contentType: 'image/png' // Optional but best practice to include this
};

const url = await amazon.getUploadPresignedUrl(client, options);
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
