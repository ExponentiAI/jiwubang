"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../classnames/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../prop-types/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtSearchBar = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtSearchBar, _AtComponent);

  function AtSearchBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtSearchBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtSearchBar.__proto__ || Object.getPrototypeOf(AtSearchBar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "anonymousState__temp5", "rootCls", "inputType", "value", "isFocus", "disabled", "maxLength", "placeholder", "actionName", "fixed", "showActionButton", "className", "customStyle"], _this.handleFocus = function () {
      var _this$props;

      _this.setState({
        isFocus: true
      });
      (_this$props = _this.props).onFocus.apply(_this$props, arguments);
    }, _this.handleBlur = function () {
      var _this$props2;

      _this.setState({
        isFocus: false
      });
      (_this$props2 = _this.props).onBlur.apply(_this$props2, arguments);
    }, _this.handleChange = function (e) {
      var _this$props3;

      for (var _len2 = arguments.length, arg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        arg[_key2 - 1] = arguments[_key2];
      }

      return (_this$props3 = _this.props).onChange.apply(_this$props3, [e.target.value].concat(arg));
    }, _this.handleClear = function () {
      for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arg[_key3] = arguments[_key3];
      }

      if (_this.props.onClear) {
        _this.props.onClear();
      } else {
        var _this$props4;

        (_this$props4 = _this.props).onChange.apply(_this$props4, [''].concat(arg));
      }
    }, _this.handleConfirm = function () {
      var _this$props5;

      return (_this$props5 = _this.props).onConfirm.apply(_this$props5, arguments);
    }, _this.handleActionClick = function () {
      var _this$props6;

      return (_this$props6 = _this.props).onActionClick.apply(_this$props6, arguments);
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtSearchBar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtSearchBar.prototype.__proto__ || Object.getPrototypeOf(AtSearchBar.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        isFocus: props.focus
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _props = this.__props,
          value = _props.value,
          placeholder = _props.placeholder,
          maxLength = _props.maxLength,
          fixed = _props.fixed,
          disabled = _props.disabled,
          showActionButton = _props.showActionButton,
          actionName = _props.actionName,
          inputType = _props.inputType,
          className = _props.className,
          customStyle = _props.customStyle;
      var isFocus = this.__state.isFocus;

      var fontSize = 14;
      var rootCls = (0, _index4.default)('at-search-bar', {
        'at-search-bar--fixed': fixed
      }, className);
      var placeholderWrapStyle = {};
      var actionStyle = {};
      if (isFocus || !isFocus && value) {
        actionStyle.opacity = 1;
        actionStyle.marginRight = "0";
        placeholderWrapStyle.flexGrow = 0;
      } else if (!isFocus && !value) {
        placeholderWrapStyle.flexGrow = 1;
        actionStyle.opacity = 0;
        actionStyle.marginRight = "-" + ((actionName.length + 1) * fontSize + 7 + 10) + "px";
      }
      if (showActionButton) {
        actionStyle.opacity = 1;
        actionStyle.marginRight = "0";
      }

      var clearIconStyle = { display: 'flex' };
      var placeholderStyle = { visibility: 'hidden' };
      if (!value.length) {
        clearIconStyle.display = 'none';
        placeholderStyle.visibility = 'visible';
      }

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(placeholderWrapStyle);
      var anonymousState__temp3 = (0, _index.internal_inline_style)(placeholderStyle);
      var anonymousState__temp4 = (0, _index.internal_inline_style)(clearIconStyle);
      var anonymousState__temp5 = (0, _index.internal_inline_style)(actionStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        anonymousState__temp5: anonymousState__temp5,
        rootCls: rootCls,
        inputType: inputType,
        value: value,
        disabled: disabled,
        maxLength: maxLength,
        placeholder: placeholder,
        actionName: actionName
      });
      return this.__state;
    }
  }]);

  return AtSearchBar;
}(_component2.default), _class.$$events = ["handleChange", "handleFocus", "handleBlur", "handleConfirm", "handleClear", "handleActionClick"], _class.$$componentPath = "home/wukuy/code/work/jiwubang/JWB_Client/JWB_Client/node_modules/taro-ui/dist/weapp/components/search-bar/index", _temp2);


AtSearchBar.defaultProps = {
  value: '',
  placeholder: '搜索',
  maxLength: 140,
  fixed: false,
  focus: false,
  disabled: false,
  showActionButton: false,
  actionName: '搜索',
  inputType: 'text',
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onConfirm: function onConfirm() {},
  onActionClick: function onActionClick() {}
};

AtSearchBar.propTypes = {
  value: _index6.default.string,
  placeholder: _index6.default.string,
  maxLength: _index6.default.number,
  fixed: _index6.default.bool,
  focus: _index6.default.bool,
  disabled: _index6.default.bool,
  showActionButton: _index6.default.bool,
  actionName: _index6.default.string,
  inputType: _index6.default.oneOf(['text', 'number', 'idcard', 'digit']),
  onChange: _index6.default.func,
  onFocus: _index6.default.func,
  onBlur: _index6.default.func,
  onConfirm: _index6.default.func,
  onActionClick: _index6.default.func,
  onClear: _index6.default.func

};

exports.default = AtSearchBar;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtSearchBar));