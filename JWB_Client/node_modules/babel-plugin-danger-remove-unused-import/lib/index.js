'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description:
 */
var getSpecImport = require('./utils/getSpecImport');

var _require = require('../package.json'),
    symbol = _require.name;

function warn() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  console.warn.apply(console, [symbol + ' Warn: \n    '].concat(args));
}
function log() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  console.log.apply(console, [symbol + ' Log: \n    '].concat(args));
}

var idTraverseObject = {
  JSXIdentifier: function JSXIdentifier(path, _ref) {
    var runtimeData = _ref.runtimeData;
    var parentPath = path.parentPath;
    var name = path.node.name;


    if (parentPath.isJSXOpeningElement() && parentPath.get('name') === path || parentPath.isJSXMemberExpression() && parentPath.get('object') === path) {
      if (runtimeData[name]) {
        delete runtimeData[name];
      }
    }
  },
  Identifier: function Identifier(path, _ref2) {
    var runtimeData = _ref2.runtimeData;
    var parentPath = path.parentPath,
        scope = path.scope;
    var name = path.node.name;
    // const ID = 'value';

    if (parentPath.isVariableDeclarator() && parentPath.get('id') === path) {}
    // const x = { Tabs: 'value' }
    else if (parentPath.isObjectProperty() && parentPath.get('key') === path &&
      // const x = { [Tabs]: 'value' }
      !parentPath.node.computed) {}
      // { Tabs: 'value' }
      else if (parentPath.isLabeledStatement() && parentPath.get('label') === path) {}
        // ref.ID
        else if (parentPath.isMemberExpression() && parentPath.get('property') === path && parentPath.node.computed === false) {}
          // class A { ID() {} }
          else if ((parentPath.isClassProperty() || parentPath.isClassMethod()) && parentPath.get('key') === path &&
            // class A { [ID]() {} }
            !parentPath.node.computed) {} else {
              // used
              if (runtimeData[name]) {
                delete runtimeData[name];
              }
            }
  }
};

var importTraverseObject = _extends({
  ImportDeclaration: function ImportDeclaration(path, data) {
    var _data$opts = data.opts,
        opts = _data$opts === undefined ? {} : _data$opts,
        runtimeData = data.runtimeData;


    path.skip();

    var locals = getSpecImport(path, { withPath: true, ignore: opts.ignore });
    if (locals) {
      locals.forEach(function (pathData, index, all) {
        var name = pathData.name;
        // already existed

        if (runtimeData.hasOwnProperty(name)) {
          warn('the declare of ', '`' + name + '`', 'is already existed');
          return;
        }
        runtimeData[name] = {
          parent: path,
          children: all,
          data: pathData
        };
      });
    }
  }
}, idTraverseObject);

function handleRemovePath(runtimeData) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$verbose = opts.verbose,
      verbose = _opts$verbose === undefined ? false : _opts$verbose;
  /*
   {
   parent: path,
   children: [ { path, name } ],
   data: { path, name }
   }
   */

  var allNames = Object.keys(runtimeData);
  verbose && log('unused-import-list', allNames);
  allNames.forEach(function (name) {
    var _runtimeData$name = runtimeData[name],
        children = _runtimeData$name.children,
        data = _runtimeData$name.data,
        parent = _runtimeData$name.parent;

    var childNames = children.map(function (x) {
      return x.name;
    });
    // every imported identifier is unused
    if (childNames.every(function (cName) {
      return allNames.includes(cName);
    })) {
      !parent.__removed && parent.remove();
      parent.__removed = true;
    } else {
      var path = data.path;
      !path.__removed && path.remove();
      path.__removed = true;
    }
  });
}

module.exports = function (babel) {
  return {
    pre: function pre(path) {
      this.runtimeData = {};
    },

    visitor: {
      Program: function Program(path, data) {
        // path.skip()
        path.traverse(importTraverseObject, {
          opts: data.opts,
          runtimeData: this.runtimeData
        });
        handleRemovePath(this.runtimeData, data.opts);
      }
    },
    post: function post() {
      delete this.runtimeData;
    }
  };
};

// expose internals for use in other plugins
module.exports.importTraverseObject = importTraverseObject;
module.exports.handleRemovePath = handleRemovePath;