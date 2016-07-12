"use strict";

const assert = require("assert");
const test = require("..");

test("sync", () => {
  assert(false);
});

test("async", () => {
  return new Promise((resolve, reject) => {
    setImmediate(reject(new TypeError("async error")));
  });
});

test.timeout = 100;
test("async:timeout", () => {
  return new Promise(() => { /* noop */ });
});
