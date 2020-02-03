"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("./util");

var _default = function _default(tokenStream) {
  var _parseShadow = (0, _util.parseShadow)(tokenStream),
      offset = _parseShadow.offset,
      radius = _parseShadow.radius,
      color = _parseShadow.color;

  return {
    $merge: {
      textShadowOffset: offset,
      textShadowRadius: radius,
      textShadowColor: color
    }
  };
};

exports["default"] = _default;