"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2; /* eslint-disable react/jsx-no-duplicate-props */


var _index = require("../../../../../@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../../../../prop-types/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../../../../classnames/index.js");

var _index6 = _interopRequireDefault(_index5);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

var _utils = require("../../common/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getMaxLength(maxLength, textOverflowForbidden) {
  if (!textOverflowForbidden) {
    return maxLength + 500;
  }
  return maxLength;
}

var ENV = _index2.default.getEnv();
(0, _utils.initTestEnv)();

var AtTextarea = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtTextarea, _AtComponent);

  function AtTextarea() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtTextarea);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtTextarea.__proto__ || Object.getPrototypeOf(AtTextarea)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "rootCls", "placeholderStyle", "placeholderCls", "cursorSpacing", "value", "actualMaxLength", "placeholder", "disabled", "autoFocus", "focus", "showConfirmBar", "selectionStart", "selectionEnd", "fixed", "count", "_maxLength", "customStyle", "className", "placeholderClass", "maxLength", "textOverflowForbidden", "height"], _this.handleInput = function () {
      var _this$props;

      return (_this$props = _this.props).onChange.apply(_this$props, arguments);
    }, _this.handleFocus = function () {
      var _this$props2;

      return (_this$props2 = _this.props).onFocus.apply(_this$props2, arguments);
    }, _this.handleBlur = function () {
      var _this$props3;

      return (_this$props3 = _this.props).onBlur.apply(_this$props3, arguments);
    }, _this.handleConfirm = function () {
      var _this$props4;

      return (_this$props4 = _this.props).onConfirm.apply(_this$props4, arguments);
    }, _this.handleLinechange = function () {
      var _this$props5;

      return (_this$props5 = _this.props).onLinechange.apply(_this$props5, arguments);
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtTextarea, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtTextarea.prototype.__proto__ || Object.getPrototypeOf(AtTextarea.prototype), "_constructor", this).call(this, props);

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
          customStyle = _props.customStyle,
          className = _props.className,
          value = _props.value,
          cursorSpacing = _props.cursorSpacing,
          placeholder = _props.placeholder,
          placeholderStyle = _props.placeholderStyle,
          placeholderClass = _props.placeholderClass,
          maxLength = _props.maxLength,
          count = _props.count,
          disabled = _props.disabled,
          autoFocus = _props.autoFocus,
          focus = _props.focus,
          showConfirmBar = _props.showConfirmBar,
          selectionStart = _props.selectionStart,
          selectionEnd = _props.selectionEnd,
          fixed = _props.fixed,
          textOverflowForbidden = _props.textOverflowForbidden,
          height = _props.height;


      var _maxLength = parseInt(maxLength);
      var actualMaxLength = getMaxLength(_maxLength, textOverflowForbidden);
      var textareaStyle = height ? "height:" + _index2.default.pxTransform(height) : '';
      var rootCls = (0, _index6.default)('at-textarea', "at-textarea--" + ENV, {
        'at-textarea--error': _maxLength < value.length
      }, className);
      var placeholderCls = (0, _index6.default)('placeholder', placeholderClass);

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(textareaStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        rootCls: rootCls,
        placeholderStyle: placeholderStyle,
        placeholderCls: placeholderCls,
        cursorSpacing: cursorSpacing,
        value: value,
        actualMaxLength: actualMaxLength,
        placeholder: placeholder,
        disabled: disabled,
        autoFocus: autoFocus,
        focus: focus,
        showConfirmBar: showConfirmBar,
        selectionStart: selectionStart,
        selectionEnd: selectionEnd,
        fixed: fixed,
        count: count,
        _maxLength: _maxLength
      });
      return this.__state;
    }
  }]);

  return AtTextarea;
}(_component2.default), _class.$$events = ["handleInput", "handleFocus", "handleBlur", "handleConfirm", "handleLinechange"], _class.$$componentPath = "home/wukuy/code/work/jiwubang/JWB_Client/JWB_Client/node_modules/taro-ui/dist/weapp/components/textarea/index", _temp2);


AtTextarea.defaultProps = {
  customStyle: '',
  className: '',
  value: '',
  cursorSpacing: 100,
  maxLength: 200,
  placeholder: '',
  disabled: false,
  autoFocus: false,
  focus: false,
  showConfirmBar: false,
  selectionStart: -1,
  selectionEnd: -1,
  count: true,
  fixed: false,
  height: '',
  textOverflowForbidden: true,
  onLinechange: function onLinechange() {},
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  onConfirm: function onConfirm() {}
};

AtTextarea.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  value: _index4.default.string.isRequired,
  cursorSpacing: _index4.default.number,
  maxLength: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  placeholderClass: _index4.default.string,
  placeholderStyle: _index4.default.string,
  placeholder: _index4.default.string,
  disabled: _index4.default.bool,
  autoFocus: _index4.default.bool,
  focus: _index4.default.bool,
  showConfirmBar: _index4.default.bool,
  selectionStart: _index4.default.number,
  selectionEnd: _index4.default.number,
  count: _index4.default.bool,
  textOverflowForbidden: _index4.default.bool,
  fixed: _index4.default.bool,
  height: _index4.default.oneOfType([_index4.default.string, _index4.default.number]),
  onLinechange: _index4.default.func,
  onChange: _index4.default.func.isRequired,
  onFocus: _index4.default.func,
  onBlur: _index4.default.func,
  onConfirm: _index4.default.func
};

exports.default = AtTextarea;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtTextarea));