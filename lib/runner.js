"use strict";

const colo = require("colo");
const puts = require("./puts");

const tests = [];
const state = { successCount: 0, failureCount: 0, skippedCount: 0 };

function addTest(test) {
  tests.push(test);
  if (tests.length === 1) {
    process.nextTick(() => {
      runTest(tests);
    });
  }
}

function runTest(tests) {
  if (tests.some(test => test.opts.only)) {
    tests.forEach((test) => {
      test.opts.skip = !test.opts.only;
    });
  }
  execTest(tests, 0);
}

function execTest(tests, index) {
  if (tests.length <= index) {
    return doneTest();
  }
  const test = tests[index];
  const name = test.name;
  const testfn = test.fn;
  const timeout = test.opts.timeout;
  const onskip = () => {
    puts(colo.yellow(`  ☐ skipped: ${ name }`));
    state.skippedCount += 1;
    execTest(tests, index + 1);
  };
  const onsuccess = () => {
    puts(colo.green(`  ✓ success: ${ name }`));
    state.successCount += 1;
    execTest(tests, index + 1);
  };
  const onfailure = (e) => {
    puts.error(colo.red(`  ✗ failure: ${ name }`));
    if (e && e.stack) {
      puts.error(colo.red(e.stack));
    }
    state.failureCount += 1;
    execTest(tests, index + 1);
  };

  puts(colo.grey(`  Test Name: ${ name }`));

  if (test.opts.skip) {
    return onskip();
  }

  let promise;

  try {
    promise = testfn();

  } catch (e) {
    return onfailure(e);
  }

  if (!promise || typeof promise.then !== "function") {
    return onsuccess();
  }

  const timerId = setTimeout(() => {
    onfailure(new Error(`timeout (${ timeout }ms)`));
  }, timeout);

  promise.then(() => {
    clearTimeout(timerId);
    onsuccess();
  }, (e) => {
    clearTimeout(timerId);
    onfailure(e);
  });
}

function doneTest() {
  puts(colo.bold.green(`✓ success count: ${ state.successCount }`));
  if (state.failureCount) {
    puts(colo.bold.red(`✗ failure count: ${ state.failureCount }`));
  }
  if (state.skippedCount) {
    puts(colo.bold.yellow(`☐ skipped count: ${ state.skippedCount }`));
  }
}

module.exports = { addTest };
