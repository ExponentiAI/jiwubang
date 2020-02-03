'use strict';

/**
 * @file: getSpecImport
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description: 
 *  check Identifier `id` is in {} or []
 *    `[id]`
 *    `{id}`
 */

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
function pureObjectHandle(path) {}

/**
 * input: `import a, {b, c as d} from 'where'`
 * output: [a, b, d]
 *
 * input: `import 'where'`
 * output: undefined
 */
function getSpecImport(path) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$withNode = opts.withNode,
      withNode = _opts$withNode === undefined ? false : _opts$withNode;
  var _path$node = path.node,
      source = _path$node.source,
      specifiers = _path$node.specifiers;


  if (t.isImportDeclaration(path)) {
    if (t.isStringLiteral(source)) {
      if (specifiers && specifiers.length > 0) {
        return getSpecifierIdentifiers(specifiers, withNode);
      }
    }
  }
}

module.exports = getSpecImport;