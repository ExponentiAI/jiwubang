'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = undefined;

var _http = require('../libs/http.js');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var login = exports.login = function login(data) {
  return _http2.default.request({
    api: 'Authentication',
    method: 'POST',
    data: data,
    showLoading: true
  });
};