'use strict';

/**
 * @file: getSpecImport
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description: 
 *  match the syntax like
 *    `import a from 'a'`
 *    `import { b, c } from 'a'`
 */
var match = require('../utils/matchRule');
var t = require('babel-core').types;

/**
 * get identifiers from the code, as follows
 *
 *  input:  `import { b, c } from 'a'`
 *  output: ['b', 'c']
 *
 *  input:  `import a from 'a'`
 *  output: ['a']
 */
function getSpecifierIdentifiers() {
  var specifiers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var withPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var collection = [];
  function loop(path, index) {
    var node = path.node;
    var item = !withPath ? node.local.name : { path: path, name: node.local.name };
    switch (node.type) {
      case 'ImportDefaultSpecifier':
      case 'ImportSpecifier':
      case 'ImportNamespaceSpecifier':
        collection.push(item);
        break;
    }
  }
  specifiers.forEach(loop);

  return collection;
}

/**
 * input: `import a, {b, c as d} from 'where'`
 * output: [a, b, d]
 *
 * input: `import 'where'`
 * output: undefined
 */
function getSpecImport(path) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$withPath = opts.withPath,
      withPath = _opts$withPath === undefined ? false : _opts$withPath,
      _opts$ignore = opts.ignore,
      ignore = _opts$ignore === undefined ? false : _opts$ignore;

  var source = path.get('source');
  var specifiers = path.get('specifiers');

  if (t.isImportDeclaration(path)) {
    if (t.isStringLiteral(source) && (!ignore || !match(ignore, source.node.value))) {
      if (specifiers && specifiers.length > 0) {
        return getSpecifierIdentifiers(specifiers, withPath);
      }
    }
  }
}

module.exports = getSpecImport;