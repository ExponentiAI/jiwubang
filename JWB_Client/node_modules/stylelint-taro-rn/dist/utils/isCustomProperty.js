"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCustomProperty = isCustomProperty;
/**
 * Check whether a property is a custom one
 */
function isCustomProperty(property /*: string */) /*: boolean */{
  return property.slice(0, 2) === "--";
}