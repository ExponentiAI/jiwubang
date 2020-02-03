"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsMatches = optionsMatches;

var _matchesStringOrRegExp = require("./matchesStringOrRegExp");

/**
 * Check if an options object's propertyName contains a user-defined string or
 * regex that matches the passed in input.
 */
function optionsMatches(options /*: Object */
, propertyName /*: string */
, input /*: string */
) /*: boolean */{
  return !!(options && options[propertyName] && typeof input === "string" && (0, _matchesStringOrRegExp.matchesStringOrRegExp)(input, options[propertyName]));
}