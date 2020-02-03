'use strict';

var babylon = require('babylon');

module.exports = objectToAST;

function objectToAST(object) {
  var stringified = stringify(object);
  var fileNode = babylon.parse(`var x = ${stringified}`);
  return fileNode.program.body[0].declarations[0].init;
}

function stringify(object) {
  var str = JSON.stringify(object, function (key, value) {
    if (typeof value === 'function') {
      return `__FUNCTION_START__${value.toString()}__FUNCTION_END__`;
    }
    return value;
  });
  if (str === undefined) {
    str = 'undefined';
  }
  return str.replace(/"__FUNCTION_START__(.*?)__FUNCTION_END__"/g, function (match, p1) {
    return p1.replace(/\\"/g, '"').replace(/\\n/g, '\n');
  });
}