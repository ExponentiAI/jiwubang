"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.ruleName = undefined;

exports.default = function (actual, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: actual
    }, {
      actual: options,
      possible: {
        ignoreProperties: [_utils.isString]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      var prop = decl.prop;

      if (!(0, _utils.isStandardSyntaxProperty)(prop)) {
        return;
      }

      if (!(0, _utils.isStandardSyntaxDeclaration)(decl)) {
        return;
      }

      if ((0, _utils.isCustomProperty)(prop)) {
        return;
      }

      if ((0, _utils.optionsMatches)(options, "ignoreProperties", prop)) {
        return;
      }

      if (props.indexOf(prop.toLowerCase()) !== -1) {
        return;
      }

      _stylelint.utils.report({
        message: messages.rejected(prop),
        node: decl,
        result: result,
        ruleName: ruleName
      });
    });
  };
};

var _stylelint = require("stylelint");

var _reactNativeKnownStylingProperties = require("react-native-known-styling-properties");

var _utils = require("../../utils");

var ruleName = exports.ruleName = (0, _utils.namespace)("style-property-no-unknown");

var messages = exports.messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected(property) {
    return "\u65E0\u6548\u7684 React Native \u6837\u5F0F\u5C5E\u6027 \"" + property + "\"";
  }
});

var props = _reactNativeKnownStylingProperties.allProps.map(_utils.kebabCase);