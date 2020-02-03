"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tokenTypes = require("../tokenTypes");

var SPACE = _tokenTypes.tokens.SPACE,
    IDENT = _tokenTypes.tokens.IDENT,
    STRING = _tokenTypes.tokens.STRING;

var _default = function _default(tokenStream) {
  var fontFamily;

  if (tokenStream.matches(STRING)) {
    fontFamily = tokenStream.lastValue;
  } else {
    fontFamily = tokenStream.expect(IDENT);

    while (tokenStream.hasTokens()) {
      tokenStream.expect(SPACE);
      var nextIdent = tokenStream.expect(IDENT);
      fontFamily += " ".concat(nextIdent);
    }
  }

  tokenStream.expectEmpty();
  return fontFamily;
};

exports["default"] = _default;