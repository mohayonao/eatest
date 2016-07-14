# eatest
[![Build Status](http://img.shields.io/travis/mohayonao/eatest.svg?style=flat-square)](https://travis-ci.org/mohayonao/eatest)
[![NPM Version](http://img.shields.io/npm/v/eatest.svg?style=flat-square)](https://www.npmjs.org/package/eatest)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

test function for [eater](https://github.com/yosuke-furukawa/eater)

## Features

- can run a test file directly on the editor / [atom-runner](https://atom.io/packages/atom-runner)
- each subtests also run in a single process, so faster then `(eater/runner).test`

## How to use

### 1. Install

```
npm install -D eater eatest
```

### 2. Write tests

```js
// test/example.js
const assert = require("assert");
const test = require("eatest");

test("success", () => {
  assert(true);
});

test("failure", () => {
  assert(false);
});

test("async/success", () => {
  return Promise.resolve(true);
});

test("async/failure", () => {
  return Promise.reject(new TypeError("async/failure"));
});

test.timeout = 100; // default timeout is 2000ms
test("async/timeout", () => {
  return new Promise(() => { /* noop */ });
});
```

### 3. Run

```
$ eater test/example.js
```

![screenshot](images/screenshot.png)

## API

- `test(name: string, testfn: function)`
- `test.skip(name: string, testfn: function)`
  - skip the test
- `test.only(name: string, testfn: function)`
  - exclude other tests in the same test file
- `test.fork(name: string, testfn: function)`
  - run the test in a child process. it is useful to avoid side effect in the test.
- `test.timeout: number`

## License

MIT
