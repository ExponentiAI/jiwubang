"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

var _index3 = require("../../../assets/images/icon/index.js");

var _home = require("../../../models/home.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// eslint-disable-next-line
var _global = global,
    regeneratorRuntime = _global.regeneratorRuntime;
var Tab = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Tab, _BaseComponent);

  function Tab() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tab);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tab.__proto__ || Object.getPrototypeOf(Tab)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "className", "prefix", "tabList", "active", "style"], _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Tab, [{
    key: "_constructor",
    value: function _constructor() {
      _get(Tab.prototype.__proto__ || Object.getPrototypeOf(Tab.prototype), "_constructor", this).call(this);
      this.prefix = 'w-tab';
      this.tabList = [{ text: '信息求助', jump: false, icon: _index3.billIco1, selectedIcon: _index3.billIco2 }, { text: '信息提供', jump: true, icon: _index3.reportIco1, selectedIcon: _index3.reportIco2 }];
      this.state = {
        active: 0
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "login",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _home.login)({});

              case 2:
                data = _context.sent;

                if (data) {
                  _index2.default.navigateTo({ url: '/pages/demand/index' });
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function login() {
        return _ref2.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: "onGetUserInfo",
    value: function onGetUserInfo(item, e) {
      if (item.jump && e.detail.userInfo) {
        this.login();
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      var prefix = this.prefix,
          tabList = this.tabList;
      var _props = this.__props,
          style = _props.style,
          _props$className = _props.className,
          className = _props$className === undefined ? '' : _props$className;
      var active = this.__state.active;

      var anonymousState__temp = (0, _index.internal_inline_style)(style);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        className: className,
        prefix: prefix,
        tabList: tabList
      });
      return this.__state;
    }
  }]);

  return Tab;
}(_component2.default), _class.$$events = ["onGetUserInfo"], _class.$$componentPath = "components/widget/Tab/index", _temp2);
exports.default = Tab;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Tab));