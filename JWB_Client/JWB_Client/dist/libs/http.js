"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _config = require("../config/config.js");

var _config2 = _interopRequireDefault(_config);

var _index3 = require("../npm/qs/lib/index.js");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dev = true;

var Http = function () {
  function Http() {
    _classCallCheck(this, Http);

    this.BASEURL = _config2.default.baseUrl;
  }

  _createClass(Http, [{
    key: "request",
    value: function request(api, data) {
      var _this = this;

      var showLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'POST';

      if (showLoading) {
        _index2.default.showLoading({
          title: 'Loading...'
        });
      }
      return new Promise(function (resolve, reject) {
        _index2.default.request({
          url: "" + (_this.BASEURL + api),
          method: method,
          data: _index4.default.stringify(data),
          credentials: 'include',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(function (res) {
          showLoading && _index2.default.hideLoading();
          resolve(res.data);
          if (!res.data.success) {
            _index2.default.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3000
            });
          }
        });
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!this.instance) {
        this.instance = new Http();
      }
      return this.instance;
    }
  }]);

  return Http;
}();

var http = Http.getInstance();
exports.default = http;