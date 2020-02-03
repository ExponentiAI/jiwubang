"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

exports.default = function (actual) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: actual
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(/^font-weight$/i, function (decl) {
      if (acceptedWeights.indexOf(decl.value) > -1) {
        return;
      }

      var weightValueOffset = decl.value.indexOf(decl.value);
      var index = declarationValueIndex(decl) + weightValueOffset;

      _stylelint.utils.report({
        message: messages.rejected(decl.value),
        node: decl,
        result: result,
        ruleName: ruleName,
        index: index
      });
    });
  };
};

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var declarationValueIndex = require("stylelint/lib/utils/declarationValueIndex");

var ruleName = exports.ruleName = (0, _utils.namespace)("font-weight-no-ignored-values");

var messages = exports.messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected(weight) {
    return "Unexpected font-weight \"" + weight + "\"";
  }
});

var acceptedWeights = ["400", "700", "normal", "bold"];