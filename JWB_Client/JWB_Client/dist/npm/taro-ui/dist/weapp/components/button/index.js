"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SIZE_CLASS = {
  normal: 'normal',
  small: 'small'
};

var TYPE_CLASS = {
  primary: 'primary',
  secondary: 'secondary'
};

var AtButton = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtButton, _AtComponent);

  function AtButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtButton.__proto__ || Object.getPrototypeOf(AtButton)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "$compid__21", "loading", "lang", "formType", "openType", "sessionFrom", "sendMessageTitle", "sendMessagePath", "sendMessageImg", "showMessageCard", "appParameter", "isWEAPP", "disabled", "isWEB", "isALIPAY", "size", "type", "circle", "full", "customStyle", "className", "children"], _this.customComponents = ["AtLoading"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtButton, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtButton.prototype.__proto__ || Object.getPrototypeOf(AtButton.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        isWEB: _index2.default.getEnv() === _index2.default.ENV_TYPE.WEB,
        isWEAPP: _index2.default.getEnv() === _index2.default.ENV_TYPE.WEAPP,
        isALIPAY: _index2.default.getEnv() === _index2.default.ENV_TYPE.ALIPAY
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (!this.props.disabled) {
        var _props;

        this.props.onClick && (_props = this.props).onClick.apply(_props, arguments);
      }
    }
  }, {
    key: "onGetUserInfo",
    value: function onGetUserInfo() {
      var _props2;

      this.props.onGetUserInfo && (_props2 = this.props).onGetUserInfo.apply(_props2, arguments);
    }
  }, {
    key: "onContact",
    value: function onContact() {
      var _props3;

      this.props.onContact && (_props3 = this.props).onContact.apply(_props3, arguments);
    }
  }, {
    key: "onGetPhoneNumber",
    value: function onGetPhoneNumber() {
      var _props4;

      this.props.onGetPhoneNumber && (_props4 = this.props).onGetPhoneNumber.apply(_props4, arguments);
    }
  }, {
    key: "onError",
    value: function onError() {
      var _props5;

      this.props.onError && (_props5 = this.props).onError.apply(_props5, arguments);
    }
  }, {
    key: "onOpenSetting",
    value: function onOpenSetting() {
      var _props6;

      this.props.onOpenSetting && (_props6 = this.props).onOpenSetting.apply(_props6, arguments);
    }
  }, {
    key: "onSumit",
    value: function onSumit() {
      if (this.state.isWEAPP || this.state.isWEB) {
        this.$scope.triggerEvent('submit', arguments[0].detail, {
          bubbles: true,
          composed: true
        });
      }
    }
  }, {
    key: "onReset",
    value: function onReset() {
      if (this.state.isWEAPP || this.state.isWEB) {
        this.$scope.triggerEvent('reset', arguments[0].detail, {
          bubbles: true,
          composed: true
        });
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _classObject;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__21"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__21 = _genCompid2[0],
          $compid__21 = _genCompid2[1];

      var _props7 = this.__props,
          _props7$size = _props7.size,
          size = _props7$size === undefined ? 'normal' : _props7$size,
          _props7$type = _props7.type,
          type = _props7$type === undefined ? '' : _props7$type,
          circle = _props7.circle,
          full = _props7.full,
          loading = _props7.loading,
          disabled = _props7.disabled,
          customStyle = _props7.customStyle,
          formType = _props7.formType,
          openType = _props7.openType,
          lang = _props7.lang,
          sessionFrom = _props7.sessionFrom,
          sendMessageTitle = _props7.sendMessageTitle,
          sendMessagePath = _props7.sendMessagePath,
          sendMessageImg = _props7.sendMessageImg,
          showMessageCard = _props7.showMessageCard,
          appParameter = _props7.appParameter;
      var _state = this.__state,
          isWEAPP = _state.isWEAPP,
          isALIPAY = _state.isALIPAY,
          isWEB = _state.isWEB;

      var rootClassName = ['at-button'];
      var classObject = (_classObject = {}, _defineProperty(_classObject, "at-button--" + SIZE_CLASS[size], SIZE_CLASS[size]), _defineProperty(_classObject, 'at-button--disabled', disabled), _defineProperty(_classObject, "at-button--" + type, TYPE_CLASS[type]), _defineProperty(_classObject, 'at-button--circle', circle), _defineProperty(_classObject, 'at-button--full', full), _classObject);
      var loadingColor = type === 'primary' ? '#fff' : '';
      var loadingSize = size === 'small' ? '30' : 0;
      var component = void 0;
      if (loading) {
        rootClassName.push('at-button--icon');
        _index.propsManager.set({
          "color": loadingColor,
          "size": loadingSize
        }, $compid__21, $prevCompid__21);
      }

      var anonymousState__temp = (0, _index6.default)(rootClassName, classObject, this.__props.className);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(customStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        $compid__21: $compid__21,
        loading: loading,
        lang: lang,
        formType: formType,
        openType: openType,
        sessionFrom: sessionFrom,
        sendMessageTitle: sendMessageTitle,
        sendMessagePath: sendMessagePath,
        sendMessageImg: sendMessageImg,
        showMessageCard: showMessageCard,
        appParameter: appParameter,
        disabled: disabled
      });
      return this.__state;
    }
  }]);

  return AtButton;
}(_component2.default), _class.$$events = ["onGetUserInfo", "onGetPhoneNumber", "onOpenSetting", "onError", "onContact", "onClick", "onSumit", "onReset"], _class.$$componentPath = "home/wukuy/code/work/jiwubang/JWB_Client/JWB_Client/node_modules/taro-ui/dist/weapp/components/button/index", _temp2);


AtButton.defaultProps = {
  size: 'normal',
  type: '',
  circle: false,
  full: false,
  loading: false,
  disabled: false,
  customStyle: {},
  onClick: function onClick() {},
  // Button props
  formType: '',
  openType: '',
  lang: 'en',
  sessionFrom: '',
  sendMessageTitle: '',
  sendMessagePath: '',
  sendMessageImg: '',
  showMessageCard: false,
  appParameter: '',
  onGetUserInfo: function onGetUserInfo() {},
  onContact: function onContact() {},
  onGetPhoneNumber: function onGetPhoneNumber() {},
  onError: function onError() {},
  onOpenSetting: function onOpenSetting() {}
};

AtButton.propTypes = {
  size: _index4.default.oneOf(['normal', 'small']),
  type: _index4.default.oneOf(['primary', 'secondary', '']),
  circle: _index4.default.bool,
  full: _index4.default.bool,
  loading: _index4.default.bool,
  disabled: _index4.default.bool,
  onClick: _index4.default.func,
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  formType: _index4.default.oneOf(['submit', 'reset', '']),
  openType: _index4.default.oneOf(['contact', 'share', 'getUserInfo', 'getPhoneNumber', 'launchApp', 'openSetting', 'feedback', 'getRealnameAuthInfo', '']),
  lang: _index4.default.string,
  sessionFrom: _index4.default.string,
  sendMessageTitle: _index4.default.string,
  sendMessagePath: _index4.default.string,
  sendMessageImg: _index4.default.string,
  showMessageCard: _index4.default.bool,
  appParameter: _index4.default.string,
  onGetUserInfo: _index4.default.func,
  onContact: _index4.default.func,
  onGetPhoneNumber: _index4.default.func,
  onError: _index4.default.func,
  onOpenSetting: _index4.default.func
};
exports.default = AtButton;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtButton));