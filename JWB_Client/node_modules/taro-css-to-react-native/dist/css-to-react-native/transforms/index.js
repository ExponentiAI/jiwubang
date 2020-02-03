"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tokenTypes = require("../tokenTypes");

var _boxShadow = _interopRequireDefault(require("./boxShadow"));

var _flex = _interopRequireDefault(require("./flex"));

var _font = _interopRequireDefault(require("./font"));

var _fontFamily = _interopRequireDefault(require("./fontFamily"));

var _textShadow = _interopRequireDefault(require("./textShadow"));

var _textDecoration = _interopRequireDefault(require("./textDecoration"));

var _textDecorationLine = _interopRequireDefault(require("./textDecorationLine"));

var _transform = _interopRequireDefault(require("./transform"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var IDENT = _tokenTypes.tokens.IDENT,
    WORD = _tokenTypes.tokens.WORD,
    COLOR = _tokenTypes.tokens.COLOR,
    LENGTH = _tokenTypes.tokens.LENGTH,
    UNSUPPORTED_LENGTH_UNIT = _tokenTypes.tokens.UNSUPPORTED_LENGTH_UNIT,
    PERCENT = _tokenTypes.tokens.PERCENT,
    AUTO = _tokenTypes.tokens.AUTO;

var background = function background(tokenStream) {
  return {
    $merge: {
      backgroundColor: tokenStream.expect(COLOR)
    }
  };
};

var border = (0, _util.anyOrderFactory)({
  borderWidth: {
    tokens: [LENGTH, UNSUPPORTED_LENGTH_UNIT],
    "default": 1
  },
  borderColor: {
    tokens: [COLOR],
    "default": "black"
  },
  borderStyle: {
    tokens: [(0, _tokenTypes.regExpToken)(/^(solid|dashed|dotted)$/)],
    "default": "solid"
  }
});
var borderColor = (0, _util.directionFactory)({
  types: [WORD],
  prefix: "border",
  suffix: "Color"
});
var borderRadius = (0, _util.directionFactory)({
  directions: ["TopLeft", "TopRight", "BottomRight", "BottomLeft"],
  prefix: "border",
  suffix: "Radius"
});
var borderWidth = (0, _util.directionFactory)({
  prefix: "border",
  suffix: "Width"
});
var margin = (0, _util.directionFactory)({
  types: [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO],
  prefix: "margin"
});
var padding = (0, _util.directionFactory)({
  prefix: "padding"
});
var flexFlow = (0, _util.anyOrderFactory)({
  flexWrap: {
    tokens: [(0, _tokenTypes.regExpToken)(/(nowrap|wrap|wrap-reverse)/)],
    "default": "nowrap"
  },
  flexDirection: {
    tokens: [(0, _tokenTypes.regExpToken)(/(row|row-reverse|column|column-reverse)/)],
    "default": "row"
  }
});

var fontVariant = function fontVariant(tokenStream) {
  return [tokenStream.expect(IDENT)];
};

var fontWeight = function fontWeight(tokenStream) {
  return tokenStream.expect(WORD);
}; // Also match numbers as strings


var shadowOffset = (0, _util.shadowOffsetFactory)();
var textShadowOffset = (0, _util.shadowOffsetFactory)();
var _default = {
  background: background,
  border: border,
  borderColor: borderColor,
  borderRadius: borderRadius,
  borderWidth: borderWidth,
  boxShadow: _boxShadow["default"],
  flex: _flex["default"],
  flexFlow: flexFlow,
  font: _font["default"],
  fontFamily: _fontFamily["default"],
  fontVariant: fontVariant,
  fontWeight: fontWeight,
  margin: margin,
  padding: padding,
  shadowOffset: shadowOffset,
  textShadow: _textShadow["default"],
  textShadowOffset: textShadowOffset,
  textDecoration: _textDecoration["default"],
  textDecorationLine: _textDecorationLine["default"],
  transform: _transform["default"]
};
exports["default"] = _default;