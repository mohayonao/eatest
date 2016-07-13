"use strict";

const assert = require("assert");
const test = require("..");

test.only("sync", () => {
  assert(true);
});

test("sync", () => {
  assert(false);
});

test("sync", () => {
  assert(false);
});

test("sync", () => {
  assert(false);
});

test.only("sync", () => {
  assert(true);
});
