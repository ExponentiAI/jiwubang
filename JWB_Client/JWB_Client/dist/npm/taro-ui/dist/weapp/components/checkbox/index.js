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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AtCheckbox = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtCheckbox, _AtComponent);

  function AtCheckbox() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtCheckbox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtCheckbox.__proto__ || Object.getPrototypeOf(AtCheckbox)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray2", "rootCls", "options", "selectedList", "customStyle", "className"], _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtCheckbox, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(AtCheckbox.prototype.__proto__ || Object.getPrototypeOf(AtCheckbox.prototype), "_constructor", this).call(this, props);

      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "handleClick",
    value: function handleClick(idx) {
      var _props = this.props,
          selectedList = _props.selectedList,
          options = _props.options;

      var option = options[idx];
      var disabled = option.disabled,
          value = option.value;

      if (disabled) {
        return;
      }var selectedSet = new Set(selectedList);
      if (!selectedSet.has(value)) {
        selectedSet.add(value);
      } else {
        selectedSet.delete(value);
      }
      this.props.onChange([].concat(_toConsumableArray(selectedSet)));
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _props2 = this.__props,
          customStyle = _props2.customStyle,
          className = _props2.className,
          options = _props2.options,
          selectedList = _props2.selectedList;


      var rootCls = (0, _index6.default)('at-checkbox', className);

      var anonymousState__temp = (0, _index.internal_inline_style)(customStyle);
      var loopArray2 = options.map(function (option, idx) {
        option = {
          $original: (0, _index.internal_get_original)(option)
        };

        var _option$$original = option.$original,
            value = _option$$original.value,
            disabled = _option$$original.disabled,
            label = _option$$original.label,
            desc = _option$$original.desc;

        var optionCls = (0, _index6.default)('at-checkbox__option', {
          'at-checkbox__option--disabled': disabled,
          'at-checkbox__option--selected': selectedList.includes(value)
        });

        return {
          value: value,
          disabled: disabled,
          label: label,
          desc: desc,
          optionCls: optionCls,
          $original: option.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray2: loopArray2,
        rootCls: rootCls,
        options: options
      });
      return this.__state;
    }
  }]);

  return AtCheckbox;
}(_component2.default), _class.$$events = ["handleClick"], _class.$$componentPath = "home/wukuy/code/work/jiwubang/JWB_Client/JWB_Client/node_modules/taro-ui/dist/weapp/components/checkbox/index", _temp2);


AtCheckbox.defaultProps = {
  customStyle: '',
  className: '',
  options: [],
  selectedList: [],
  onChange: function onChange() {}
};

AtCheckbox.propTypes = {
  customStyle: _index4.default.oneOfType([_index4.default.object, _index4.default.string]),
  className: _index4.default.oneOfType([_index4.default.array, _index4.default.string]),
  options: _index4.default.array,
  selectedList: _index4.default.array,
  onChange: _index4.default.func
};
exports.default = AtCheckbox;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtCheckbox));