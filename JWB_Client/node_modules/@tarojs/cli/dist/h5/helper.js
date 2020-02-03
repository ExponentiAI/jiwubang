"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("babel-types");
const lodash_1 = require("lodash");
const rimraf = require("rimraf");
const astConvert_1 = require("../util/astConvert");
const util_1 = require("util");
exports.pRimraf = util_1.promisify(rimraf);
/**
 * 判断是否为子页面
 * @param parentPath
 */
exports.isUnderSubPackages = (parentPath) => (parentPath.isObjectProperty() && /subpackages/i.test(astConvert_1.convertAstExpressionToVariable(parentPath.node.key)));
function createRoute({ pageName, isIndex, lazyload = true }) {
    const absPagename = exports.addLeadingSlash(pageName);
    const relPagename = `.${absPagename}`;
    const chunkName = relPagename.split('/').filter(v => !/^(pages|\.)$/i.test(v)).join('_');
    if (lazyload) {
        const chunkNameComment = chunkName ? `/* webpackChunkName: "${chunkName}" */` : '';
        return `{
      path: '${absPagename}',
      componentLoader: () => import(${chunkNameComment}'${relPagename}'),
      isIndex: ${isIndex}
    }`;
    }
    else {
        return `{
      path: '${absPagename}',
      componentLoader: () => Promise.resolve(require('${relPagename}')),
      isIndex: ${isIndex}
    }`;
    }
}
exports.createRoute = createRoute;
/**
 * TS 编译器会把 class property 移到构造器，
 * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
 * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
 * 如果有 config 就给他还原
 */
function resetTSClassProperty(body) {
    for (const method of body) {
        if (t.isClassMethod(method) && method.kind === 'constructor') {
            for (const statement of lodash_1.cloneDeep(method.body.body)) {
                if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
                    const expr = statement.expression;
                    const { left, right } = expr;
                    if (t.isMemberExpression(left) &&
                        t.isThisExpression(left.object) &&
                        t.isIdentifier(left.property)) {
                        if ((t.isArrowFunctionExpression(right) || t.isFunctionExpression(right)) ||
                            (left.property.name === 'config' && t.isObjectExpression(right))) {
                            body.push(t.classProperty(left.property, right));
                            lodash_1.remove(method.body.body, statement);
                        }
                    }
                }
            }
        }
    }
}
exports.resetTSClassProperty = resetTSClassProperty;
exports.addLeadingSlash = (url) => url.charAt(0) === '/' ? url : '/' + url;
exports.removeLeadingSlash = (url) => url.replace(/^\.?\//, '');
exports.stripTrailingSlash = (url) => url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
exports.isTaroClass = (astPath) => {
    let isTaroClass = false;
    astPath.traverse({
        ClassMethod(astPath) {
            const key = astPath.get('key');
            if (t.isIdentifier(key.node) && key.node.name === 'render') {
                astPath.traverse({
                    ReturnStatement(astPath) {
                        const argument = astPath.get('argument');
                        if (argument) {
                            isTaroClass = true;
                        }
                    }
                });
            }
        }
    });
    return isTaroClass;
};
