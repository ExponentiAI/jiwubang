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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Index = (_temp2 = _class = function (_BaseComponent) {
  _inherits(Index, _BaseComponent);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "anonymousState__temp2", "$compid__22", "$compid__23", "$compid__24", "$compid__25", "$compid__26", "$compid__27", "showMyAccordion", "showShopAccordion", "checkedList"], _this.config = {
      navigationBarTitleText: '信息提供'
    }, _this.customComponents = ["UPage", "AtButton", "AtAccordion", "AtTextarea", "AtCheckbox"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: "_constructor",
    value: function _constructor() {
      _get(Index.prototype.__proto__ || Object.getPrototypeOf(Index.prototype), "_constructor", this).apply(this, arguments);

      this.checkboxOption = [{
        value: '1',
        label: '外科用口罩'
      }, {
        value: '2',
        label: 'N95口罩'
      }, {
        value: '3',
        label: '一次性普遍口罩'
      }];
      this.state = {
        showMyAccordion: false,
        showShopAccordion: true,
        checkedList: []
      };
      this.$$refs = new _index2.default.RefsArray();
    }
  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var _genCompid = (0, _index.genCompid)(__prefix + "$compid__22"),
          _genCompid2 = _slicedToArray(_genCompid, 2),
          $prevCompid__22 = _genCompid2[0],
          $compid__22 = _genCompid2[1];

      var _genCompid3 = (0, _index.genCompid)(__prefix + "$compid__23"),
          _genCompid4 = _slicedToArray(_genCompid3, 2),
          $prevCompid__23 = _genCompid4[0],
          $compid__23 = _genCompid4[1];

      var _genCompid5 = (0, _index.genCompid)(__prefix + "$compid__24"),
          _genCompid6 = _slicedToArray(_genCompid5, 2),
          $prevCompid__24 = _genCompid6[0],
          $compid__24 = _genCompid6[1];

      var _genCompid7 = (0, _index.genCompid)(__prefix + "$compid__25"),
          _genCompid8 = _slicedToArray(_genCompid7, 2),
          $prevCompid__25 = _genCompid8[0],
          $compid__25 = _genCompid8[1];

      var _genCompid9 = (0, _index.genCompid)(__prefix + "$compid__26"),
          _genCompid10 = _slicedToArray(_genCompid9, 2),
          $prevCompid__26 = _genCompid10[0],
          $compid__26 = _genCompid10[1];

      var _genCompid11 = (0, _index.genCompid)(__prefix + "$compid__27"),
          _genCompid12 = _slicedToArray(_genCompid11, 2),
          $prevCompid__27 = _genCompid12[0],
          $compid__27 = _genCompid12[1];

      var _state = this.__state,
          showMyAccordion = _state.showMyAccordion,
          showShopAccordion = _state.showShopAccordion,
          checkedList = _state.checkedList;

      var anonymousState__temp = { width: '60%' };

      this.anonymousFunc0 = function (val) {
        return _this2.setState({ showMyAccordion: val });
      };

      this.anonymousFunc1 = function (val) {
        return _this2.setState({ showShopAccordion: val });
      };

      var anonymousState__temp2 = { borderTop: 'none', borderRadius: 0 };

      this.anonymousFunc2 = function () {};

      this.anonymousFunc3 = function (val) {
        return _this2.setState({ checkedList: val });
      };

      _index.propsManager.set({
        "className": "p-demand-page",
        "showBottom": true,
        "titleImmerse": true
      }, $compid__22, $prevCompid__22);
      _index.propsManager.set({
        "className": "p-submit-btn",
        "type": "primary",
        "circle": true,
        "size": "small",
        "customStyle": anonymousState__temp
      }, $compid__23, $prevCompid__23);
      _index.propsManager.set({
        "open": showMyAccordion,
        "onClick": this.anonymousFunc0,
        "title": "\u6211\u7684\u4F4D\u7F6E"
      }, $compid__24, $prevCompid__24);
      _index.propsManager.set({
        "open": showShopAccordion,
        "onClick": this.anonymousFunc1,
        "title": "\u5546\u5E97\u6240\u5728\u4F4D\u7F6E"
      }, $compid__25, $prevCompid__25);
      _index.propsManager.set({
        "customStyle": anonymousState__temp2,
        "value": "",
        "onChange": this.anonymousFunc2,
        "maxLength": 200,
        "placeholder": "\u63CF\u8FF0\u4F60\u77E5\u9053\u7684\u4FE1\u606F..."
      }, $compid__26, $prevCompid__26);
      _index.propsManager.set({
        "onChange": this.anonymousFunc3,
        "options": this.checkboxOption,
        "selectedList": checkedList
      }, $compid__27, $prevCompid__27);
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        anonymousState__temp2: anonymousState__temp2,
        $compid__22: $compid__22,
        $compid__23: $compid__23,
        $compid__24: $compid__24,
        $compid__25: $compid__25,
        $compid__26: $compid__26,
        $compid__27: $compid__27
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
  }, {
    key: "anonymousFunc2",
    value: function anonymousFunc2(e) {
      ;
    }
  }, {
    key: "anonymousFunc3",
    value: function anonymousFunc3(e) {
      ;
    }
  }]);

  return Index;
}(_index.Component), _class.$$events = [], _class.$$componentPath = "pages/demand/index", _temp2);
exports.default = Index;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Index, true));