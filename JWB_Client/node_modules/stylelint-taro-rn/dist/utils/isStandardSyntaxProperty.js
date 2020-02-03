"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStandardSyntaxProperty = isStandardSyntaxProperty;

var _endsWith = require("./endsWith");

var hasInterpolation = require("../utils/hasInterpolation");

/**
 * Check whether a property is standard
 */
function isStandardSyntaxProperty(property /*: string */
) /*: boolean */{
  // SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
  if (property[0] === "$") {
    return false;
  }

  // Less var (e.g. @var: x)
  if (property[0] === "@") {
    return false;
  }

  // Less append property value with space (e.g. transform+_: scale(2))
  if ((0, _endsWith.endsWith)(property, "+") || (0, _endsWith.endsWith)(property, "+_")) {
    return false;
  }

  // SCSS or Less interpolation
  if (hasInterpolation(property)) {
    return false;
  }

  return true;
}