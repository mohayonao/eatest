"use strict";

const assert = require("assert");
const test = require("..");

test.fork("fork", () => {
  global.Math.random = () => 0.5;
  assert(Math.random() === Math.random());
});

test.fork("fork/failure", () => {
  assert(Math.random() === Math.random());
});

test("no side effects", () => {
  assert(Math.random() !== Math.random());
});
