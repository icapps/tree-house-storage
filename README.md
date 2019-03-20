# Treehouse boilerplate

NodeJS boilerplate module written in typescript

[![npm version](https://badge.fury.io/js/tree-house-boilerplate.svg)](https://badge.fury.io/js/tree-house-boilerplate)
[![Dependencies](https://david-dm.org/icapps/tree-house-boilerplate.svg)](https://david-dm.org/icapps/tree-house-boilerplate.svg)
[![Build Status](https://travis-ci.org/icapps/tree-house-boilerplate.svg?branch=master)](https://travis-ci.org/icapps/tree-house-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-boilerplate/badge.svg)](https://coveralls.io/github/icapps/tree-house-boilerplate)

## Usage

### Clone this project

```shell
git clone git@github.com:icapps/tree-house-boilerplate.git
```

> Copy code to new git project, commit and start making your new module

## Typescript

The project is written in Typescript. More information can be found [here](https://www.typescriptlang.org/).

## TSlint

TSLint is an extensible static analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. It is widely supported across modern editors & build systems and can be customized with your own lint rules, configurations, and formatters. More information can be found [here](https://palantir.github.io/tslint/).

## NPM

Node Package Manager has been integrated to publish the package afterwards. Npm is the package manager for JavaScript and the world's largest software registry. This way these modules can be used within the actual NodeJS project using `npm install`.

### Release

Releasing a new version of the module has been made easy using [np](https://www.npmjs.com/package/np).

```shell
npm run release
```

## Travis CI

Travis CI is a hosted, distributed continuous integration service used to build and test software projects hosted at GitHub. There is a `.travis.yml` file included in the boilerplate. You still need to enable the module in [Travis CI](https://travis-ci.org/). This will allow you to run your tests and other checks for commits, pull requests and or merges automatically.

## Coveralls

Ensure that all your new code is fully covered, and see coverage trends emerge. Works with any CI service. This way you can track the coverage progress for each commit and/or branch in a visual overview. You still need to enable the module in [Coveralls.io](https://coveralls.io/). It will automatically be trigged as the last step in Travis CI described in the `.travis.yml` file.

## Tests

All tests are written using Jest. Check out the documentation [here](https://jestjs.io/docs/en/getting-started) for more information.

  You can run `npm run test` to run all tests

  You can run `npm run test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house-boilerplate/issues](https://github.com/icapps/tree-house-boilerplate/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house-boilerplate/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
