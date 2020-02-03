"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namespace = namespace;
var prefix = "taro-rn";

function namespace(ruleName) {
  return prefix + "/" + ruleName;
}