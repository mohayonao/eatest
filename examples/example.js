"use strict";

const assert = require("assert");
const test = require("..");

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

test.timeout = 100;
test("async/timeout", () => {
  return new Promise(() => { /* noop */ });
});
