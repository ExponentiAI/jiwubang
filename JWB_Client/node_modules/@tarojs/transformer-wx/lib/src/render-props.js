"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("babel-types");
const utils_1 = require("./utils");
const jsx_1 = require("./jsx");
const lodash_1 = require("lodash");
const renderPropsMap = new Map();
const RENDER_PROPS_EVENTS = '$$renderPropsEvents';
function injectRenderPropsListener(attrPath, attrName, attrExpr, componentName) {
    const randomLetters = utils_1.createRandomLetters(5);
    const renderClosureFuncName = attrName + randomLetters;
    const jsxDecl = utils_1.buildConstVariableDeclaration(renderClosureFuncName, attrExpr);
    const block = jsx_1.buildBlockElement([], true);
    const renderPropsArgs = t.memberExpression(t.thisExpression(), t.identifier(renderClosureFuncName));
    renderPropsMap.set(componentName + '_' + attrName, renderClosureFuncName);
    block.children = [
        t.jSXExpressionContainer(t.callExpression(t.identifier(renderClosureFuncName), [renderPropsArgs]))
    ];
    const listener = buildListener(renderClosureFuncName, renderPropsArgs);
    const stemParent = attrPath.getStatementParent();
    stemParent.insertBefore(listener);
    stemParent.insertBefore(jsxDecl);
    attrPath.get('value').replaceWith(t.jSXExpressionContainer(block));
    setRenderPropsEvents(attrPath, renderClosureFuncName);
}
exports.injectRenderPropsListener = injectRenderPropsListener;
function setRenderPropsEvents(attrPath, renderClosureFuncName) {
    const classDecl = attrPath.findParent(p => p.isClassDeclaration());
    if (classDecl && classDecl.isClassDeclaration()) {
        let hasEvent = false;
        for (const s of classDecl.node.body.body) {
            if (t.isClassProperty(s) && s.key.name === RENDER_PROPS_EVENTS && t.isArrayExpression(s.value)) {
                hasEvent = true;
                if (s.value.elements.some(e => t.isStringLiteral(e) && e.value === renderClosureFuncName)) {
                    break;
                }
                s.value.elements.push(t.stringLiteral(renderClosureFuncName));
            }
        }
        if (!hasEvent) {
            classDecl.node.body.body.push(t.classProperty(t.identifier(RENDER_PROPS_EVENTS), t.arrayExpression([t.stringLiteral(renderClosureFuncName)])));
        }
    }
}
function injectRenderPropsEmiter(callExpr, attrName) {
    const classDecl = callExpr.findParent(p => p.isClassDeclaration());
    const classDeclName = classDecl && classDecl.isClassDeclaration() && lodash_1.get(classDecl, 'node.id.name', '');
    if (typeof classDeclName !== 'string') {
        throw utils_1.codeFrameError(classDecl, '使用 render props 必须指定 class 的名称。');
    }
    const renderClosureFuncName = renderPropsMap.get(classDeclName + '_' + attrName) || '';
    const args = [t.stringLiteral(renderClosureFuncName)];
    if (Array.isArray(callExpr.node.arguments) && callExpr.node.arguments.length) {
        args.push(callExpr.node.arguments[0]);
    }
    const emitter = t.callExpression(t.memberExpression(buildEventCenterMemberExpr(), t.identifier('trigger')), args);
    const stemParent = callExpr.getStatementParent();
    stemParent.insertBefore(t.expressionStatement(emitter));
}
exports.injectRenderPropsEmiter = injectRenderPropsEmiter;
function buildListener(renderClosureFuncName, renderPropsArgs) {
    return t.expressionStatement(t.callExpression(t.memberExpression(buildEventCenterMemberExpr(), t.identifier('on')), [t.stringLiteral(renderClosureFuncName), t.arrowFunctionExpression([t.identifier('e')], t.blockStatement([
            t.ifStatement(t.unaryExpression('!', t.callExpression(t.memberExpression(t.identifier('Taro'), t.identifier('shallowEqual')), [t.identifier('e'), renderPropsArgs])), t.blockStatement([
                t.expressionStatement(t.assignmentExpression('=', renderPropsArgs, t.identifier('e'))),
                t.expressionStatement(t.callExpression(t.memberExpression(t.thisExpression(), t.identifier('setState')), [t.objectExpression([])]))
            ]))
        ]))]));
}
function buildEventCenterMemberExpr() {
    return t.memberExpression(t.identifier('Taro'), t.identifier('eventCenter'));
}
//# sourceMappingURL=render-props.js.map