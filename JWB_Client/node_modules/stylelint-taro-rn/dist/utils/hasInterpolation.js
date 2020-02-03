"use strict";

var hasLessInterpolation = require("../utils/hasLessInterpolation");
var hasPsvInterpolation = require("../utils/hasPsvInterpolation");
var hasScssInterpolation = require("../utils/hasScssInterpolation");
/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
module.exports = function (string /*: string */) /*: boolean */{
  // SCSS or Less interpolation
  if (hasLessInterpolation(string) || hasScssInterpolation(string) || hasPsvInterpolation(string)) {
    return true;
  }

  return false;
};