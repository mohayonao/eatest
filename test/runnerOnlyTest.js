"use strict";

const path = require("path");
const cp = require("child_process");
const assert = require("assert");
const rematch = (str, re) => [].concat(str.match(re))[0];

const testpath = path.join(__dirname, "..", "examples", "runnerOnlyTest.js");
const runner = cp.spawnSync("eater", [ testpath ]);
const output = runner.stdout.toString();

const success = rematch(output, /✓ success count: \d+/);
const failure = rematch(output, /✗ failure count: \d+/);
const skipped = rematch(output, /🛪 skipped count: \d+/);

assert(success === "✓ success count: 2");
assert(failure === null);
assert(skipped === "🛪 skipped count: 3");

const totalSuccess = rematch(output, /✓ Total success count: \d+/);
const totalFailure = rematch(output, /✗ Total failure count: \d+/);

assert(totalSuccess === "✓ Total success count: 1");
assert(totalFailure === null);
