"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var endsWith = exports.endsWith = function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};