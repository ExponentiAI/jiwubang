"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var kebabCase = exports.kebabCase = function kebabCase(string) {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};