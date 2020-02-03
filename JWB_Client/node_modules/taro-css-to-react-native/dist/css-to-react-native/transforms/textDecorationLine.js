"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tokenTypes = require("../tokenTypes");

var SPACE = _tokenTypes.tokens.SPACE,
    LINE = _tokenTypes.tokens.LINE;

var _default = function _default(tokenStream) {
  var lines = [];
  var didParseFirst = false;

  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE);
    lines.push(tokenStream.expect(LINE).toLowerCase());
    didParseFirst = true;
  }

  lines.sort().reverse();
  return lines.join(" ");
};

exports["default"] = _default;