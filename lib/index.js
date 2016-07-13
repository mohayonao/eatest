"use strict";

const runner = require("./runner");

const test = (name, fn) => {
  const opts = { timeout: test.timeout };

  runner.addTest({ name, fn, opts });
};

test.skip = (name, fn) => {
  const opts = { timeout: test.timeout, skip: true };

  runner.addTest({ name, fn, opts });
};

test.only = (name, fn) => {
  const opts = { timeout: test.timeout, only: true };

  runner.addTest({ name, fn, opts });
};

test.timeout = 2000;

module.exports = test;
