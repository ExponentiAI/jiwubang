"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tokenTypes = require("../tokenTypes");

var NONE = _tokenTypes.tokens.NONE,
    AUTO = _tokenTypes.tokens.AUTO,
    NUMBER = _tokenTypes.tokens.NUMBER,
    LENGTH = _tokenTypes.tokens.LENGTH,
    SPACE = _tokenTypes.tokens.SPACE;
var defaultFlexGrow = 1;
var defaultFlexShrink = 1;
var defaultFlexBasis = 0;

var _default = function _default(tokenStream) {
  var flexGrow;
  var flexShrink;
  var flexBasis;

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty();
    return {
      $merge: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "auto"
      }
    };
  }

  tokenStream.saveRewindPoint();

  if (tokenStream.matches(AUTO) && !tokenStream.hasTokens()) {
    return {
      $merge: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto"
      }
    };
  }

  tokenStream.rewind();
  var partsParsed = 0;

  while (partsParsed < 2 && tokenStream.hasTokens()) {
    if (partsParsed !== 0) tokenStream.expect(SPACE);

    if (flexGrow === undefined && tokenStream.matches(NUMBER)) {
      flexGrow = tokenStream.lastValue;
      tokenStream.saveRewindPoint();

      if (tokenStream.matches(SPACE) && tokenStream.matches(NUMBER)) {
        flexShrink = tokenStream.lastValue;
      } else {
        tokenStream.rewind();
      }
    } else if (flexBasis === undefined && tokenStream.matches(LENGTH)) {
      flexBasis = tokenStream.lastValue;
    } else if (flexBasis === undefined && tokenStream.matches(AUTO)) {
      flexBasis = "auto";
    } else {
      tokenStream["throw"]();
    }

    partsParsed += 1;
  }

  tokenStream.expectEmpty();
  if (flexGrow === undefined) flexGrow = defaultFlexGrow;
  if (flexShrink === undefined) flexShrink = defaultFlexShrink;
  if (flexBasis === undefined) flexBasis = defaultFlexBasis;
  return {
    $merge: {
      flexGrow: flexGrow,
      flexShrink: flexShrink,
      flexBasis: flexBasis
    }
  };
};

exports["default"] = _default;