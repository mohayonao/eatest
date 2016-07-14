"use strict";

const colo = require("colo");
const cp = require("child_process");
const puts = require("./puts");

const tests = [];
const state = { successCount: 0, failureCount: 0, skippedCount: 0 };

function addTest(test) {
  tests.push(test);
  if (tests.length === 1) {
    process.nextTick(() => {
      if (tests.some(test => test.opts.only)) {
        tests.forEach((test) => {
          test.opts.skip = !test.opts.only;
        });
      }
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
    if (e && e.stack) {
      puts.error(colo.red(e.stack));
    }
    puts.error(colo.red(`  ✗ failure: ${ name }`));
    state.failureCount += 1;
    execTest(tests, index + 1);
  };

  if (process.env.EATEST_FORKTEST) {
    if (index < +process.env.EATEST_FORKTEST) {
      return execTest(tests, index + 1);
    }
    return runTest(test, () => {}, (e) => {
      if (e && e.stack) {
        puts.error(colo.red(e.stack));
      }
    });
  }

  puts(colo.grey(`  Test Name: ${ name }`));

  if (test.opts.skip) {
    return onskip();
  }

  if (test.opts.fork) {
    return forkTest(index, onsuccess, onfailure);
  }

  return runTest(test, onsuccess, onfailure);
}

function runTest(test, onsuccess, onfailure) {
  const testfn = test.fn;
  const timeout = test.opts.timeout;

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

function forkTest(index, onsuccess, onfailure) {
  const child = cp.fork(process.argv[1], {
    silent: true, env: { EATEST_FORKTEST: "" + index }
  });

  let hasError = false;

  child.stdout.setEncoding("utf-8");
  child.stdout.on("data", (data) => {
    puts(data);
  });

  child.stderr.setEncoding("utf-8");
  child.stderr.on("data", (data) => {
    hasError = true;
    puts.error(data);
  });

  child.on("close", () => {
    (hasError ? onfailure : onsuccess)();
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
