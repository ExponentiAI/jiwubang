"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index2 = require("../../../../../@tarojs/taro-weapp/index.js");

var _index3 = _interopRequireDefault(_index2);

var _index4 = require("../../../../../prop-types/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../../../../classnames/index.js");

var _index7 = _interopRequireDefault(_index6);

var _utils = require("../../common/utils.js");

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENV = _index3.default.getEnv();
var MIN_DISTANCE = 100;
var MAX_INTERVAL = 10;

var AtTabs = (_temp2 = _class = function (_AtComponent) {
  _inherits(AtTabs, _AtComponent);

  function AtTabs() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AtTabs);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AtTabs.__proto__ || Object.getPrototypeOf(AtTabs)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "anonymousState__temp3", "anonymousState__temp4", "loopArray1", "tabList", "rootCls", "scroll", "_tabId", "scrollX", "scrollY", "_scrollLeft", "_scrollTop", "_scrollIntoView", "swipeable", "tabDirection", "current", "customStyle", "className", "height", "animated", "children"], _this.updateState = function (idx) {
      if (_this.props.scroll) {
        // 标签栏滚动
        switch (ENV) {
          case _index3.default.ENV_TYPE.WEAPP:
          case _index3.default.ENV_TYPE.ALIPAY:
          case _index3.default.ENV_TYPE.SWAN:
            var index = Math.max(idx - 1, 0);
            _this.setState({
              _scrollIntoView: "tab" + index
            });
            break;

          case _index3.default.ENV_TYPE.WEB:
            {
              var _index = Math.max(idx - 1, 0);
              var prevTabItem = _this.tabHeaderRef.childNodes[_index];
              prevTabItem && _this.setState({
                _scrollTop: prevTabItem.offsetTop,
                _scrollLeft: prevTabItem.offsetLeft
              });
              break;
            }

          default:
            console.warn('AtTab 组件在该环境还未适配');
            break;
        }
      }
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AtTabs, [{
    key: "_constructor",
    value: function _constructor() {
      _get(AtTabs.prototype.__proto__ || Object.getPrototypeOf(AtTabs.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        _scrollLeft: '',
        _scrollTop: '',
        _scrollIntoView: ''
      };
      this._tabId = (0, _utils.isTest)() ? 'tabs-AOTU2018' : (0, _utils.uuid)();
      // 触摸时的原点
      this._touchDot = 0;
      // 定时器
      this._timer = null;
      // 滑动时间间隔
      this._interval = 0;
      // 是否已经在滑动
      this._isMoving = false;
      this.$$refs = new _index3.default.RefsArray();
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      var _props;

      (_props = this.props).onClick.apply(_props, arguments);
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(e) {
      var _this2 = this;

      var _props2 = this.props,
          swipeable = _props2.swipeable,
          tabDirection = _props2.tabDirection;

      if (!swipeable || tabDirection === 'vertical') {
        return;
      } // 获取触摸时的原点
      this._touchDot = e.touches[0].pageX;
      // 使用js计时器记录时间
      this._timer = setInterval(function () {
        _this2._interval++;
      }, 100);
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(e) {
      var _props3 = this.props,
          swipeable = _props3.swipeable,
          tabDirection = _props3.tabDirection,
          current = _props3.current,
          tabList = _props3.tabList;

      if (!swipeable || tabDirection === 'vertical') {
        return;
      }var touchMove = e.touches[0].pageX;
      var moveDistance = touchMove - this._touchDot;
      var maxIndex = tabList.length;

      if (!this._isMoving && this._interval < MAX_INTERVAL && this._touchDot > 20) {
        // 向左滑动
        if (current + 1 < maxIndex && moveDistance <= -100) {
          this._isMoving = true;
          this.handleClick(current + 1);

          // 向右滑动
        } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
          this._isMoving = true;
          this.handleClick(current - 1);
        }
      }
    }
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd() {
      var _props4 = this.props,
          swipeable = _props4.swipeable,
          tabDirection = _props4.tabDirection;

      if (!swipeable || tabDirection === 'vertical') {
        return;
      }clearInterval(this._timer);
      this._interval = 0;
      this._isMoving = false;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.scroll !== this.props.scroll) {
        this.getTabHeaderRef();
      }
      if (nextProps.current !== this.props.current) {
        this.updateState(nextProps.current);
      }
    }
  }, {
    key: "getTabHeaderRef",
    value: function getTabHeaderRef() {
      if (ENV === _index3.default.ENV_TYPE.WEB) {
        this.tabHeaderRef = document.getElementById(this._tabId);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getTabHeaderRef();
      this.updateState(this.props.current);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.tabHeaderRef = null;
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _classNames;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      var _tabId = this._tabId;
      var _props5 = this.__props,
          customStyle = _props5.customStyle,
          className = _props5.className,
          height = _props5.height,
          tabDirection = _props5.tabDirection,
          animated = _props5.animated,
          tabList = _props5.tabList,
          scroll = _props5.scroll,
          current = _props5.current;
      var _state = this.__state,
          _scrollLeft = _state._scrollLeft,
          _scrollTop = _state._scrollTop,
          _scrollIntoView = _state._scrollIntoView;


      var heightStyle = { height: height };
      var underlineStyle = {
        height: tabDirection === 'vertical' ? tabList.length * 100 + "%" : '1PX',
        width: tabDirection === 'horizontal' ? tabList.length * 100 + "%" : '1PX'
      };
      var bodyStyle = {};
      var transformStyle = "translate3d(0px, -" + current * 100 + "%, 0px)";
      if (tabDirection === 'horizontal') {
        transformStyle = "translate3d(-" + current * 100 + "%, 0px, 0px)";
      }
      Object.assign(bodyStyle, {
        'transform': transformStyle,
        '-webkit-transform': transformStyle
      });
      if (!animated) {
        bodyStyle.transition = 'unset';
      }

      var rootCls = (0, _index7.default)((_classNames = {
        'at-tabs': true,
        'at-tabs--scroll': scroll
      }, _defineProperty(_classNames, "at-tabs--" + tabDirection, true), _defineProperty(_classNames, "at-tabs--" + ENV, true), _classNames), className);
      var scrollX = tabDirection === 'horizontal';
      var scrollY = tabDirection === 'vertical';

      var anonymousState__temp = (0, _index2.internal_inline_style)(this.mergeStyle(heightStyle, customStyle));
      var anonymousState__temp2 = scroll ? (0, _index2.internal_inline_style)(heightStyle) : null;
      var anonymousState__temp3 = (0, _index2.internal_inline_style)(this.mergeStyle(bodyStyle, heightStyle));
      var anonymousState__temp4 = (0, _index2.internal_inline_style)(underlineStyle);
      var loopArray1 = tabList.map(function (item, idx) {
        item = {
          $original: (0, _index2.internal_get_original)(item)
        };

        var itemCls = (0, _index7.default)({
          'at-tabs__item': true,
          'at-tabs__item--active': current === idx
        });

        return {
          itemCls: itemCls,
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        anonymousState__temp3: anonymousState__temp3,
        anonymousState__temp4: anonymousState__temp4,
        loopArray1: loopArray1,
        tabList: tabList,
        rootCls: rootCls,
        scroll: scroll,
        _tabId: _tabId,
        scrollX: scrollX,
        scrollY: scrollY
      });
      return this.__state;
    }
  }]);

  return AtTabs;
}(_component2.default), _class.$$events = ["handleClick", "handleTouchStart", "handleTouchEnd", "handleTouchMove"], _class.$$componentPath = "home/wukuy/code/work/jiwubang/JWB_Client/JWB_Client/node_modules/taro-ui/dist/weapp/components/tabs/index", _temp2);


AtTabs.defaultProps = {
  isTest: false,
  customStyle: '',
  className: '',
  tabDirection: 'horizontal',
  height: '',
  current: 0,
  swipeable: true,
  scroll: false,
  animated: true,
  tabList: [],
  onClick: function onClick() {}
};

AtTabs.propTypes = {
  customStyle: _index5.default.oneOfType([_index5.default.object, _index5.default.string]),
  className: _index5.default.oneOfType([_index5.default.array, _index5.default.string]),
  isTest: _index5.default.bool,
  height: _index5.default.string,
  tabDirection: _index5.default.oneOf(['horizontal', 'vertical']),
  current: _index5.default.number,
  swipeable: _index5.default.bool,
  scroll: _index5.default.bool,
  animated: _index5.default.bool,
  tabList: _index5.default.array,
  onClick: _index5.default.func
};
exports.default = AtTabs;

Component(require('../../../../../@tarojs/taro-weapp/index.js').default.createComponent(AtTabs));