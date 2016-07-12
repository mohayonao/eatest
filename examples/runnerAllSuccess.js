"use strict";

const assert = require("assert");
const test = require("..");

test("sync", () => {
  assert(true);
});

test("async", () => {
  return new Promise((resolve) => {
    setImmediate(() => {
      resolve(true);
    });
  });
});
