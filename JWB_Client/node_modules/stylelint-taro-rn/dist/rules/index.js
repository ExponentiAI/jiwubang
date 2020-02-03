"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cssPropertyNoUnknown = require("./css-property-no-unknown");

var _cssPropertyNoUnknown2 = _interopRequireDefault(_cssPropertyNoUnknown);

var _stylePropertyNoUnknown = require("./style-property-no-unknown");

var _stylePropertyNoUnknown2 = _interopRequireDefault(_stylePropertyNoUnknown);

var _fontWeightNoIgnoredValues = require("./font-weight-no-ignored-values");

var _fontWeightNoIgnoredValues2 = _interopRequireDefault(_fontWeightNoIgnoredValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  "font-weight-no-ignored-values": _fontWeightNoIgnoredValues2.default,
  "css-property-no-unknown": _cssPropertyNoUnknown2.default,
  "style-property-no-unknown": _stylePropertyNoUnknown2.default
};