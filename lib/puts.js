"use strict";

const puts = (mes) => {
  global.console.log(mes);
};

puts.error = (mes) => {
  global.console.error(mes);
};

module.exports = puts;
