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

var _index3 = require("../../assets/images/icon/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// eslint-disable-next-line
var _global = global,
    regeneratorRuntime = _global.regeneratorRuntime;
var Index = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Index, _BaseComponent);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["$compid__152", "$compid__153", "$compid__154", "$compid__155", "$compid__156", "$compid__157", "$compid__158", "$compid__159", "$compid__160", "markers", "latitude", "longitude", "open", "homeData", "tabBarIdx", "keyword", "tabsIdx"], _this.config = {
      navigationBarTitleText: '信息求助',
      navigationStyle: 'custom'
    }, _this.customComponents = ["UPage", "WTab", "AtTabs", "AtTabsPane", "WMessageItem", "AtSearchBar"], _temp), _possibleConstructorReturn(_this, _ret);
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
        tabsIdx: 0,
        latitude: 0,
        longitude: 0,
        markers: []
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getLocation();
    }
  }, {
    key: "getLocation",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var location, latitude, longitude;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index2.default.getLocation({ isHighAccuracy: true });

              case 2:
                location = _context.sent;
                latitude = location.latitude;
                longitude = location.longitude;

                this.setState({
                  latitude: latitude,
                  longitude: longitude,
                  markers: [{
                    iconPath: _index3.mapLocation,
                    id: 0,
                    latitude: latitude,
                    longitude: longitude,
                    width: 50,
                    height: 50
                  }]
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getLocation() {
        return _ref2.apply(this, arguments);
      }

      return getLocation;
    }()
  }, {
    key: "tabbarClick",
    value: function tabbarClick() {}
  }, {
    key: "searchChange",
    value: function searchChange() {}
  }, {
    key: "mapClick",
    value: function mapClick(_ref3) {
      var _ref3$detail = _ref3.detail,
          longitude = _ref3$detail.longitude,
          latitude = _ref3$detail.latitude;

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
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__152"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__152 = _genCompid2[0],
          $compid__152 = _genCompid2[1];

      var _genCompid3 = (0, _index.genCompid)(__prefix + "$compid__153"),
          _genCompid4 = _slicedToArray(_genCompid3, 2),
          $prevCompid__153 = _genCompid4[0],
          $compid__153 = _genCompid4[1];

      var _genCompid5 = (0, _index.genCompid)(__prefix + "$compid__154"),
          _genCompid6 = _slicedToArray(_genCompid5, 2),
          $prevCompid__154 = _genCompid6[0],
          $compid__154 = _genCompid6[1];

      var _genCompid7 = (0, _index.genCompid)(__prefix + "$compid__155"),
          _genCompid8 = _slicedToArray(_genCompid7, 2),
          $prevCompid__155 = _genCompid8[0],
          $compid__155 = _genCompid8[1];

      var _genCompid9 = (0, _index.genCompid)(__prefix + "$compid__156"),
          _genCompid10 = _slicedToArray(_genCompid9, 2),
          $prevCompid__156 = _genCompid10[0],
          $compid__156 = _genCompid10[1];

      var _genCompid11 = (0, _index.genCompid)(__prefix + "$compid__157"),
          _genCompid12 = _slicedToArray(_genCompid11, 2),
          $prevCompid__157 = _genCompid12[0],
          $compid__157 = _genCompid12[1];

      var _genCompid13 = (0, _index.genCompid)(__prefix + "$compid__158"),
          _genCompid14 = _slicedToArray(_genCompid13, 2),
          $prevCompid__158 = _genCompid14[0],
          $compid__158 = _genCompid14[1];

      var _genCompid15 = (0, _index.genCompid)(__prefix + "$compid__159"),
          _genCompid16 = _slicedToArray(_genCompid15, 2),
          $prevCompid__159 = _genCompid16[0],
          $compid__159 = _genCompid16[1];

      var _genCompid17 = (0, _index.genCompid)(__prefix + "$compid__160"),
          _genCompid18 = _slicedToArray(_genCompid17, 2),
          $prevCompid__160 = _genCompid18[0],
          $compid__160 = _genCompid18[1];

      var _state = this.__state,
          keyword = _state.keyword,
          tabBarIdx = _state.tabBarIdx,
          markers = _state.markers,
          tabsIdx = _state.tabsIdx,
          latitude = _state.latitude,
          longitude = _state.longitude;

      _index.propsManager.set({
        "value": keyword,
        "onChange": this.searchChange.bind(this),
        "className": "p-search-bar",
        "showActionButton": true
      }, $compid__152, $prevCompid__152);
      _index.propsManager.set({
        "className": "p-home-page",
        "showBottom": true
      }, $compid__153, $prevCompid__153);
      _index.propsManager.set({
        "className": "g-safe-area"
      }, $compid__154, $prevCompid__154);
      _index.propsManager.set({
        "className": "p-tabs",
        "current": tabsIdx,
        "tabList": this.tabList,
        "onClick": this.tabsClick.bind(this)
      }, $compid__155, $prevCompid__155);
      _index.propsManager.set({
        "className": "p-tabs-pane",
        "current": tabsIdx,
        "index": 0
      }, $compid__156, $prevCompid__156);
      _index.propsManager.set({
        "style": "border-bottom: none"
      }, $compid__157, $prevCompid__157);
      _index.propsManager.set({
        "className": "p-tabs-pane",
        "current": tabsIdx,
        "index": 1
      }, $compid__158, $prevCompid__158);
      _index.propsManager.set({
        "className": "p-tabs-pane",
        "current": tabsIdx,
        "index": 2
      }, $compid__159, $prevCompid__159);
      _index.propsManager.set({
        "style": "border-bottom: none"
      }, $compid__160, $prevCompid__160);
      Object.assign(this.__state, {
        $compid__152: $compid__152,
        $compid__153: $compid__153,
        $compid__154: $compid__154,
        $compid__155: $compid__155,
        $compid__156: $compid__156,
        $compid__157: $compid__157,
        $compid__158: $compid__158,
        $compid__159: $compid__159,
        $compid__160: $compid__160
      });
      return this.__state;
    }
  }]);

  return Index;
}(_index.Component), _class.$$events = ["mapClick"], _class.$$componentPath = "pages/home/index", _temp2);
exports.default = Index;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Index, true));