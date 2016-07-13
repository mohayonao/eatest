"use strict";

const assert = require("assert");
const test = require("..");

test("sync", () => {
  assert(true);
});

test.skip("sync/skip", () => {
  assert(false);
});

test("sync", () => {
  assert(false);
});

test.skip("sync/skip", () => {
  assert(false);
});

test("sync", () => {
  assert(true);
});
