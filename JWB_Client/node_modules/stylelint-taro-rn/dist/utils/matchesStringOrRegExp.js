"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchesStringOrRegExp = matchesStringOrRegExp;
/**
 * Compares a string to a second value that, if it fits a certain convention,
 * is converted to a regular expression before the comparison.
 * If it doesn't fit the convention, then two strings are compared.
 *
 * Any strings starting and ending with `/` are interpreted
 * as regular expressions.
 */
function matchesStringOrRegExp(input /*: string | Array<string> */
, comparison /*: string | Array<string> */
) /*: false | { match: string, pattern: string } */{
  if (!Array.isArray(input)) {
    return testAgainstStringOrRegExpOrArray(input, comparison);
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var inputItem = _step.value;

      var testResult = testAgainstStringOrRegExpOrArray(inputItem, comparison);
      if (testResult) {
        return testResult;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
}

function testAgainstStringOrRegExpOrArray(value, comparison) {
  if (!Array.isArray(comparison)) {
    return testAgainstStringOrRegExp(value, comparison);
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = comparison[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var comparisonItem = _step2.value;

      var testResult = testAgainstStringOrRegExp(value, comparisonItem);
      if (testResult) {
        return testResult;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return false;
}

function testAgainstStringOrRegExp(value, comparison) {
  // If it's a RegExp, test directly
  if (comparison instanceof RegExp) {
    return comparison.test(value) ? { match: value, pattern: comparison } : false;
  }

  // Check if it's RegExp in a string
  var firstComparisonChar = comparison[0];
  var lastComparisonChar = comparison[comparison.length - 1];
  var secondToLastComparisonChar = comparison[comparison.length - 2];

  var comparisonIsRegex = firstComparisonChar === "/" && (lastComparisonChar === "/" || secondToLastComparisonChar === "/" && lastComparisonChar === "i");

  var hasCaseInsensitiveFlag = comparisonIsRegex && lastComparisonChar === "i";

  // If so, create a new RegExp from it
  if (comparisonIsRegex) {
    var valueMatches = hasCaseInsensitiveFlag ? new RegExp(comparison.slice(1, -2), "i").test(value) : new RegExp(comparison.slice(1, -1)).test(value);
    return valueMatches ? { match: value, pattern: comparison } : false;
  }

  // Otherwise, it's a string. Do a strict comparison
  return value === comparison ? { match: value, pattern: comparison } : false;
}