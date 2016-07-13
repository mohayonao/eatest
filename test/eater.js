"use strict";

const path = require("path");
const cp = require("child_process");
const assert = require("assert");
const rematch = (str, re) => [].concat(str.match(re))[0];

const testpath = path.join(__dirname, "..", "examples");
const runner = cp.spawnSync("eater", [ "--dir", testpath ]);
const output = runner.stdout.toString();

const totalSuccess = rematch(output, /✓ Total success count: \d+/);
const totalFailure = rematch(output, /✗ Total failure count: \d+/);

assert(totalSuccess === "✓ Total success count: 2");
assert(totalFailure === "✗ Total failure count: 3");
