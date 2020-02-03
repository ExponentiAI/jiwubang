"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _component = require("../../common/component.js");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

;

var Page = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Page, _BaseComponent);

  function Page() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Page);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Page.__proto__ || Object.getPrototypeOf(Page)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "$compid__15", "prefix", "empty", "transparent", "mainPaddingTop", "mainPaddingBottom", "titleImmerse", "className", "showBottom", "onePxTransparent", "renderTop", "children", "renderBottom"], _this.onScroll = function (event) {
      _this.props.onScroll && _this.props.onScroll(event);
      // 沉浸式
      if (_this.props.titleImmerse) {
        var transparent = Math.min(1, _this.onePxTransparent * event.detail.scrollTop);
        _this.setState({
          transparent: transparent
        });
      }
    }, _this.customComponents = ["UEmpty"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Page, [{
    key: "_constructor",
    value: function _constructor() {
      _get(Page.prototype.__proto__ || Object.getPrototypeOf(Page.prototype), "_constructor", this).apply(this, arguments);
      this.state = {
        transparent: Number(!this.props.titleImmerse),
        mainPaddingTop: '0px',
        mainPaddingBottom: '0px'
      };
      this.prefix = 'u-page';
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setMainStyle();
    }
  }, {
    key: "setMainStyle",
    value: function setMainStyle() {
      var _this2 = this;

      if (!this.props.titleImmerse) {
        var paddingTop = void 0;
        var paddingBottom = void 0;
        {
          this.top.fields({ size: true }, function (res) {
            paddingTop = res.height + 'px';
            _this2.setState({
              mainPaddingTop: paddingTop
            });
          }).exec();
          this.bottom && this.bottom.fields({ size: true }, function (res) {
            if (res) {
              paddingBottom = res.height + 'px';
              _this2.setState({
                mainPaddingBottom: paddingBottom
              });
            }
          }).exec();
        }
      }
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this3 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      var prefix = this.prefix;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__15"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__15 = _genCompid2[0],
          $compid__15 = _genCompid2[1];

      var statusBarHeight = _index2.default.getSystemInfoSync().statusBarHeight;
      var _state = this.__state,
          mainPaddingTop = _state.mainPaddingTop,
          mainPaddingBottom = _state.mainPaddingBottom;
      var _props = this.__props,
          titleImmerse = _props.titleImmerse,
          empty = _props.empty;

      var anonymousState__temp = (0, _index.internal_inline_style)({
        paddingTop: statusBarHeight + 'px',
        backgroundColor: titleImmerse ? "rgba(255, 255, 255, 0)" : undefined
      });
      var anonymousState__temp2 = (0, _index.internal_inline_style)({ paddingTop: mainPaddingTop, paddingBottom: mainPaddingBottom });
      empty && _index.propsManager.set({
        "style": "padding-top: 200px"
      }, $compid__15, $prevCompid__15);
      this.$$refs.pushRefs([{
        type: "dom",
        id: "azzzz",
        refName: "",
        fn: function fn(c) {
          return _this3.top = c;
        }
      }, {
        type: "dom",
        id: "bzzzz",
        refName: "",
        fn: function fn(c) {
          return _this3.main = c;
        }
      }, {
        type: "dom",
        id: "dzzzz",
        refName: "",
        fn: function fn(c) {
          return _this3.bottom = c;
        }
      }]);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        $compid__15: $compid__15,
        prefix: prefix,
        empty: empty,
        onePxTransparent: this.onePxTransparent
      });
      return this.__state;
    }
  }, {
    key: "funPrivateczzzz",
    value: function funPrivateczzzz() {
      return this.props.onScroll.apply(undefined, Array.prototype.slice.call(arguments, 1));
    }
  }, {
    key: "onePxTransparent",
    get: function get() {
      return 0.01;
    }
  }]);

  return Page;
}(_component2.default), _class.$$events = ["funPrivateczzzz"], _class.multipleSlots = true, _class.$$componentPath = "components/ui/Page/index", _temp2);
exports.default = Page;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Page));