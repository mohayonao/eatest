"use strict";

const colo = require("colo");
const puts = require("./puts");

const tests = [];

function test(name, fn) {
  const timeout = test.timeout;

  tests.push({ name, fn, timeout });
  if (tests.length === 1) {
    process.nextTick(() => {
      execTest(tests, { successCount: 0, failureCount: 0 }).then(doneTest);
    });
  }
}

function execTest(tests, state) {
  const exec = (prev, test) => {
    const name = test.name;
    const testfn = test.fn;
    const timeout = test.timeout;

    function ptest(promise) {
      return new Promise((resolve, reject) => {
        const timerId = setTimeout(() => {
          reject(new Error(`timeout (${ timeout }ms)`));
        }, timeout);
        const onsuccess = () => {
          clearTimeout(timerId);
          resolve();
        };
        const onfailure = (e) => {
          clearTimeout(timerId);
          reject(e);
        };

        return promise.then(onsuccess, onfailure);
      });
    }

    const onsuccess = () => {
      puts(colo.bold.green(`  ✓ success: ${ name }`));
      state.successCount += 1;
      return state;
    };
    const onfailure = (e) => {
      puts.error(colo.bold.red(`  ✗ failure: ${ name }`));
      if (e && e.stack) {
        puts.error(colo.red(e.stack));
      }
      state.failureCount += 1;
      return state;
    };

    return prev.then(() => {
      puts(colo.grey(`  Test Name: ${ name }`));

      const promise = testfn();

      if (promise && typeof promise.then === "function") {
        return ptest(promise);
      }
    }).then(onsuccess, onfailure);
  };

  return tests.reduce(exec, Promise.resolve(state));
}

function doneTest(state) {
  puts(colo.green(`✓ success count: ${ state.successCount }`));
  if (state.failureCount) {
    puts(colo.red(`✗ failure count: ${ state.failureCount }`));
  }
}

test.timeout = 2000;

module.exports = test;
