"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtDivider = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtDivider, _AtComponent);

  function AtDivider() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtDivider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtDivider.__proto__ || Object.getPrototypeOf(AtDivider)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "content", "className", "customStyle", "height", "fontColor", "fontSize", "lineColor", "children"], _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtDivider, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtDivider.prototype.__proto__ || Object.getPrototypeOf(AtDivider.prototype), "_constructor", this).apply(this, arguments);
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
          className = _props.className,
          customStyle = _props.customStyle,
          content = _props.content,
          height = _props.height,
          fontColor = _props.fontColor,
          fontSize = _props.fontSize,
          lineColor = _props.lineColor;


      var rootStyle = {
        height: height ? "" + _index2.default.pxTransform(height) : ''
      };

      var fontStyle = {
        'color': fontColor,
        'font-size': fontSize ? "" + _index2.default.pxTransform(fontSize) : ''
      };

      var lineStyle = {
        'background-color': lineColor
      };

      var anonymousState__temp = (0, _index6.default)('at-divider', className);
      var anonymousState__temp2 = (0, _index.internal_inline_style)(this.mergeStyle(rootStyle, customStyle));
      var anonymousState__temp3 = (0, _index.internal_inline_style)(fontStyle);
      var anonymousState__temp4 = (0, _index.internal_inline_style)(lineStyle);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        content: content
      });
      return this.__state;
    }
  }]);

  return AtDivider;
}(_component2.default), _class.$$events = [], _class.$$componentPath = "home/wukuy/code/work/jiwubang/JWB_Client/JWB_Client/node_modules/taro-ui/dist/weapp/components/divider/index", _temp2);


AtDivider.defaultProps = {
  content: '',
  height: 0,
  fontColor: '',
  fontSize: 0,
  lineColor: ''
};

AtDivider.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  content: _index4.default.string,
  height: _index4.default.oneOfType([_index4.default.number, _index4.default.string]),
  fontColor: _index4.default.string,
  fontSize: _index4.default.oneOfType([_index4.default.number, _index4.default.string]),
  lineColor: _index4.default.string
};
exports.default = AtDivider;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtDivider));