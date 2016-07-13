"use strict";

const colo = require("colo");
const puts = require("./puts");

const tests = [];
const state = { successCount: 0, failureCount: 0 };

function test(name, fn) {
  const timeout = test.timeout;

  tests.push({ name, fn, timeout });
  if (tests.length === 1) {
    process.nextTick(() => {
      execTest(tests, 0);
    });
  }
}

function execTest(tests, index) {
  if (tests.length <= index) {
    return doneTest();
  }
  const test = tests[index];
  const name = test.name;
  const testfn = test.fn;
  const timeout = test.timeout;
  const onsuccess = () => {
    puts(colo.bold.green(`  ✓ success: ${ name }`));
    state.successCount += 1;
    execTest(tests, index + 1);
  };
  const onfailure = (e) => {
    puts.error(colo.bold.red(`  ✗ failure: ${ name }`));
    if (e && e.stack) {
      puts.error(colo.red(e.stack));
    }
    state.failureCount += 1;
    execTest(tests, index + 1);
  };

  puts(colo.grey(`  Test Name: ${ name }`));

  function ptest(promise) {
    const timerId = setTimeout(() => {
      onfailure(new Error(`timeout (${ timeout }ms)`));
    }, timeout);

    return promise.then(() => {
      clearTimeout(timerId);
      onsuccess();
    }, (e) => {
      clearTimeout(timerId);
      onfailure(e);
    });
  }

  try {
    const promise = testfn();

    if (promise && typeof promise.then === "function") {
      ptest(promise);
    } else {
      onsuccess();
    }
  } catch (e) {
    onfailure(e);
  }
}

function doneTest() {
  puts(colo.green(`✓ success count: ${ state.successCount }`));
  if (state.failureCount) {
    puts(colo.red(`✗ failure count: ${ state.failureCount }`));
  }
}

test.timeout = 2000;

module.exports = test;
