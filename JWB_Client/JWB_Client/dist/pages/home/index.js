"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _http = require("../../libs/http.js");

var _http2 = _interopRequireDefault(_http);

var _api = require("../../api/api.js");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isWapp = "weapp";

var Index = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Index, _BaseComponent);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["$compid__0", "$compid__1", "$compid__2", "$compid__3", "$compid__4", "$compid__5", "$compid__6", "$compid__7", "$compid__8", "$compid__9", "$compid__10", "$compid__11", "$compid__12", "open", "homeData", "tabBarIdx", "keyword", "tabsIdx"], _this.config = {
      navigationBarTitleText: '信息求助',
      navigationStyle: 'custom'
    }, _this.customComponents = ["UPage", "WTab", "AtTabs", "AtTabsPane", "WMessageItem", "AtDivider", "AtModal", "AtModalContent", "AtModalAction", "AtSearchBar"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Index.prototype.__proto__ || Object.getPrototypeOf(Index.prototype), "_constructor", this).call(this, props);

      this.tabList = [{ title: '热门' }, { title: '最新' }, { title: '我的' }];
      this.state = {
        open: true,
        homeData: {},
        tabBarIdx: 0,
        keyword: '',
        tabsIdx: 0
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      _index2.default.showShareMenu().then(function () {
        _this2.onShareAppMessage;
      });
    }
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage(res) {
      // 这是分享配置
      return {
        title: '老板记账  收支更清晰',
        path: '/pages/index/index'
      };
    }
  }, {
    key: "homeInfo",
    value: function homeInfo() {
      var _this3 = this;

      // 网络http请求示例
      _http2.default.request(_api2.default.getUser).then(function (res) {
        if (res.success) {
          _this3.setState({}, function () {
            // ...
          });
        }
      });
    }
  }, {
    key: "tabbarClick",
    value: function tabbarClick() {}
  }, {
    key: "searchChange",
    value: function searchChange() {}
  }, {
    key: "mapClick",
    value: function mapClick(_ref2) {
      var _ref2$detail = _ref2.detail,
          longitude = _ref2$detail.longitude,
          latitude = _ref2$detail.latitude;

      console.log(longitude, latitude);
    }
  }, {
    key: "tabsClick",
    value: function tabsClick(value) {
      this.setState({
        tabsIdx: value
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this4 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__0"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__0 = _genCompid2[0],
          $compid__0 = _genCompid2[1];

      var _genCompid3 = (0, _index.genCompid)(__prefix + "$compid__1"),
          _genCompid4 = _slicedToArray(_genCompid3, 2),
          $prevCompid__1 = _genCompid4[0],
          $compid__1 = _genCompid4[1];

      var _genCompid5 = (0, _index.genCompid)(__prefix + "$compid__2"),
          _genCompid6 = _slicedToArray(_genCompid5, 2),
          $prevCompid__2 = _genCompid6[0],
          $compid__2 = _genCompid6[1];

      var _genCompid7 = (0, _index.genCompid)(__prefix + "$compid__3"),
          _genCompid8 = _slicedToArray(_genCompid7, 2),
          $prevCompid__3 = _genCompid8[0],
          $compid__3 = _genCompid8[1];

      var _genCompid9 = (0, _index.genCompid)(__prefix + "$compid__4"),
          _genCompid10 = _slicedToArray(_genCompid9, 2),
          $prevCompid__4 = _genCompid10[0],
          $compid__4 = _genCompid10[1];

      var _genCompid11 = (0, _index.genCompid)(__prefix + "$compid__5"),
          _genCompid12 = _slicedToArray(_genCompid11, 2),
          $prevCompid__5 = _genCompid12[0],
          $compid__5 = _genCompid12[1];

      var _genCompid13 = (0, _index.genCompid)(__prefix + "$compid__6"),
          _genCompid14 = _slicedToArray(_genCompid13, 2),
          $prevCompid__6 = _genCompid14[0],
          $compid__6 = _genCompid14[1];

      var _genCompid15 = (0, _index.genCompid)(__prefix + "$compid__7"),
          _genCompid16 = _slicedToArray(_genCompid15, 2),
          $prevCompid__7 = _genCompid16[0],
          $compid__7 = _genCompid16[1];

      var _genCompid17 = (0, _index.genCompid)(__prefix + "$compid__8"),
          _genCompid18 = _slicedToArray(_genCompid17, 2),
          $prevCompid__8 = _genCompid18[0],
          $compid__8 = _genCompid18[1];

      var _genCompid19 = (0, _index.genCompid)(__prefix + "$compid__9"),
          _genCompid20 = _slicedToArray(_genCompid19, 2),
          $prevCompid__9 = _genCompid20[0],
          $compid__9 = _genCompid20[1];

      var _genCompid21 = (0, _index.genCompid)(__prefix + "$compid__10"),
          _genCompid22 = _slicedToArray(_genCompid21, 2),
          $prevCompid__10 = _genCompid22[0],
          $compid__10 = _genCompid22[1];

      var _genCompid23 = (0, _index.genCompid)(__prefix + "$compid__11"),
          _genCompid24 = _slicedToArray(_genCompid23, 2),
          $prevCompid__11 = _genCompid24[0],
          $compid__11 = _genCompid24[1];

      var _genCompid25 = (0, _index.genCompid)(__prefix + "$compid__12"),
          _genCompid26 = _slicedToArray(_genCompid25, 2),
          $prevCompid__12 = _genCompid26[0],
          $compid__12 = _genCompid26[1];

      var _state = this.__state,
          keyword = _state.keyword,
          tabBarIdx = _state.tabBarIdx,
          open = _state.open,
          tabsIdx = _state.tabsIdx;


      this.anonymousFunc0 = function () {
        _this4.setState({
          open: false
        });
      };

      this.anonymousFunc1 = function () {
        _this4.setState({
          open: false
        });
      };

      _index.propsManager.set({
        "value": keyword,
        "onChange": this.searchChange.bind(this),
        "className": "p-search-bar",
        "showActionButton": true
      }, $compid__0, $prevCompid__0);
      _index.propsManager.set({
        "className": "p-home-page",
        "showBottom": true
      }, $compid__1, $prevCompid__1);
      _index.propsManager.set({
        "className": "g-safe-area"
      }, $compid__2, $prevCompid__2);
      _index.propsManager.set({
        "className": "p-tabs",
        "current": tabsIdx,
        "tabList": this.tabList,
        "onClick": this.tabsClick.bind(this)
      }, $compid__3, $prevCompid__3);
      _index.propsManager.set({
        "className": "p-tabs-pane",
        "current": tabsIdx,
        "index": 0
      }, $compid__4, $prevCompid__4);
      _index.propsManager.set({
        "style": "border-bottom: none"
      }, $compid__5, $prevCompid__5);
      _index.propsManager.set({
        "content": "\u6CA1\u6709\u66F4\u591A\u4E86"
      }, $compid__6, $prevCompid__6);
      _index.propsManager.set({
        "className": "p-tabs-pane",
        "current": tabsIdx,
        "index": 1
      }, $compid__7, $prevCompid__7);
      _index.propsManager.set({
        "content": "\u6CA1\u6709\u66F4\u591A\u4E86"
      }, $compid__8, $prevCompid__8);
      _index.propsManager.set({
        "className": "p-tabs-pane",
        "current": tabsIdx,
        "index": 2
      }, $compid__9, $prevCompid__9);
      _index.propsManager.set({
        "style": "border-bottom: none"
      }, $compid__10, $prevCompid__10);
      _index.propsManager.set({
        "content": "\u6CA1\u6709\u66F4\u591A\u4E86"
      }, $compid__11, $prevCompid__11);
      _index.propsManager.set({
        "isOpened": open,
        "closeOnClickOverlay": false
      }, $compid__12, $prevCompid__12);
      Object.assign(this.__state, {
        $compid__0: $compid__0,
        $compid__1: $compid__1,
        $compid__2: $compid__2,
        $compid__3: $compid__3,
        $compid__4: $compid__4,
        $compid__5: $compid__5,
        $compid__6: $compid__6,
        $compid__7: $compid__7,
        $compid__8: $compid__8,
        $compid__9: $compid__9,
        $compid__10: $compid__10,
        $compid__11: $compid__11,
        $compid__12: $compid__12
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(e) {
      ;
    }
  }, {
    key: "anonymousFunc1",
    value: function anonymousFunc1(e) {
      ;
    }
  }]);

  return Index;
}(_index.Component), _class.$$events = ["mapClick", "anonymousFunc0", "anonymousFunc1"], _class.$$componentPath = "pages/home/index", _temp2);
exports.default = Index;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Index, true));