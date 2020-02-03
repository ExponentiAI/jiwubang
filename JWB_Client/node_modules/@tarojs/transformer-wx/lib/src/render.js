"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel_traverse_1 = require("babel-traverse");
const t = require("babel-types");
const babel_core_1 = require("babel-core");
const utils_1 = require("./utils");
const lodash_1 = require("lodash");
const jsx_1 = require("./jsx");
const constant_1 = require("./constant");
const adapter_1 = require("./adapter");
const options_1 = require("./options");
const babel_generator_1 = require("babel-generator");
const env_1 = require("./env");
const functional_1 = require("./functional");
const template = require('babel-template');
function findParents(path, predicates) {
    const parents = [];
    // tslint:disable-next-line:no-conditional-assignment
    while (path = path.parentPath) {
        if (predicates(path)) {
            parents.push(path);
        }
    }
    return parents;
}
function isClassDcl(p) {
    return p.isClassExpression() || p.isClassDeclaration();
}
function isChildrenOfJSXAttr(p) {
    return !!p.findParent(p => p.isJSXAttribute());
}
function buildAssignState(pendingState) {
    return t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
        t.memberExpression(t.thisExpression(), t.identifier('state')),
        pendingState
    ]));
}
const incrementCalleeId = utils_1.incrementId();
const incrementLoopArrayId = utils_1.incrementId();
class RenderParser {
    /**
     *
     * @param renderPath
     * @param referencedIdentifiers
     * 这三个属性是需要单独传入的
     */
    constructor(renderPath, methods, initState, referencedIdentifiers, usedState, customComponentNames, componentProperies, loopRefs, refObjExpr, methodName) {
        this.classProperties = new Set();
        this.templates = new Map();
        this.jsxDeclarations = new Set();
        this.loopScopes = new Set();
        this.returnedPaths = [];
        this.usedThisState = new Set();
        this.loopComponents = new Map();
        this.loopComponentNames = new Map();
        this.loopRefIdentifiers = new Map();
        this.reserveStateWords = new Set(functional_1.Status.isSFC ? [] : ['state', 'props']);
        this.topLevelIfStatement = new Set();
        this.usedEvents = new Set();
        this.loopCalleeId = new Set();
        this.usedThisProperties = new Set();
        this.incrementCalleeId = env_1.isTestEnv ? utils_1.incrementId() : incrementCalleeId;
        this.loopArrayId = env_1.isTestEnv ? utils_1.incrementId() : incrementLoopArrayId;
        this.classComputedState = new Set();
        this.propsSettingExpressions = new Map();
        this.genCompidExprs = new Set();
        this.loopCallees = new Set();
        this.loopIfStemComponentMap = new Map();
        this.hasNoReturnLoopStem = false;
        this.isDefaultRender = false;
        // private renderArg: t.Identifier | t.ObjectPattern | null = null
        this.renderMethodName = '';
        this.deferedHandleClosureJSXFunc = [];
        this.ancestorConditions = new Set();
        this.handleJSXElement = (jsxElementPath, func) => {
            const parentNode = jsxElementPath.parent;
            const parentPath = jsxElementPath.parentPath;
            const isJSXChildren = t.isJSXElement(parentNode);
            if (!isJSXChildren) {
                let statementParent = jsxElementPath.getStatementParent();
                const isReturnStatement = statementParent.isReturnStatement();
                const isIfStemInLoop = this.isIfStemInLoop(jsxElementPath);
                const isFinalReturn = statementParent.getFunctionParent().isClassMethod();
                if (!(statementParent.isVariableDeclaration() ||
                    statementParent.isExpressionStatement())) {
                    statementParent = statementParent.findParent(s => s.isVariableDeclaration() || s.isExpressionStatement());
                }
                if (t.isVariableDeclarator(parentNode)) {
                    if (statementParent) {
                        const name = utils_1.findIdentifierFromStatement(statementParent.node);
                        // setTemplate(name, path, templates)
                        name && this.templates.set(name, jsxElementPath.node);
                    }
                }
                func({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn, isIfStemInLoop });
            }
        };
        this.isIfStemInLoop = (p) => {
            const ifStem = p.findParent(p => p.isIfStatement());
            if (ifStem && ifStem.isIfStatement()) {
                const loopStem = ifStem.findParent(p => p.isCallExpression());
                if (loopStem && utils_1.isArrayMapCallExpression(loopStem)) {
                    return true;
                }
            }
            return false;
        };
        this.isLiteralOrUndefined = (node) => t.isLiteral(node) || t.isIdentifier(node, { name: 'undefined' });
        this.replaceIdWithTemplate = (handleRefId = false) => (path) => {
            if (!t.isJSXAttribute(path.parent)) {
                path.traverse({
                    Identifier: (path) => {
                        const parentPath = path.parentPath;
                        if (parentPath.isConditionalExpression() ||
                            parentPath.isLogicalExpression() ||
                            path.isReferencedIdentifier()) {
                            const name = path.node.name;
                            if (handleRefId && Object.keys(this.renderScope.getAllBindings()).includes(name)) {
                                this.addRefIdentifier(path, path.node);
                                // referencedIdentifiers.add(path.node)
                            }
                            if (this.templates.has(name)) {
                                path.replaceWith(this.templates.get(name));
                            }
                        }
                    }
                });
            }
        };
        this.hasStateOrProps = (key) => (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === key;
        this.returnedifStemJSX = new Set();
        this.loopComponentVisitor = {
            VariableDeclarator: (path) => {
                const id = path.get('id');
                const init = path.get('init');
                const parentPath = path.parentPath;
                if (id.isObjectPattern() &&
                    init.isThisExpression() &&
                    parentPath.isVariableDeclaration()) {
                    const { properties } = id.node;
                    this.destructStateOrProps('state', path, properties, parentPath);
                    this.destructStateOrProps('props', path, properties, parentPath);
                }
            },
            JSXElement: {
                enter: (jsxElementPath) => {
                    this.handleJSXElement(jsxElementPath, (options) => {
                        this.handleConditionExpr(options, jsxElementPath);
                        if (this.isIfStemInLoop(jsxElementPath)) {
                            this.handleJSXInIfStatement(jsxElementPath, options);
                            this.removeJSXStatement();
                        }
                        if (options.parentPath.isReturnStatement() && this.returnedifStemJSX.has(options.parentPath.scope)) {
                            const block = jsx_1.buildBlockElement();
                            jsx_1.setJSXAttr(block, adapter_1.Adapter.else);
                            block.children = [jsxElementPath.node];
                            jsxElementPath.replaceWith(block);
                            this.returnedifStemJSX.delete(options.parentPath.scope);
                        }
                    });
                },
                exit: (jsxElementPath) => {
                    this.handleJSXElement(jsxElementPath, ({ parentNode, parentPath, statementParent, isFinalReturn }) => {
                        if (statementParent && statementParent.findParent(p => p === this.renderPath)) {
                            this.jsxDeclarations.add(statementParent);
                        }
                        if (t.isReturnStatement(parentNode)) {
                            if (!isFinalReturn) {
                                const callExpr = parentPath.findParent(p => p.isCallExpression());
                                if (callExpr && callExpr.isCallExpression()) {
                                    const callee = callExpr.node.callee;
                                    if (this.loopComponents.has(callExpr)) {
                                        return;
                                    }
                                    if (t.isMemberExpression(callee) &&
                                        t.isIdentifier(callee.property) &&
                                        callee.property.name === 'map') {
                                        let ary = callee.object;
                                        if (t.isCallExpression(ary) || utils_1.isContainFunction(callExpr.get('callee').get('object'))) {
                                            this.loopCallees.add(ary);
                                            const variableName = `${constant_1.LOOP_CALLEE}_${this.incrementCalleeId()}`;
                                            callExpr.getStatementParent().insertBefore(utils_1.buildConstVariableDeclaration(variableName, utils_1.setParentCondition(jsxElementPath, ary, true)));
                                            ary = t.identifier(variableName);
                                        }
                                        if (t.isMemberExpression(ary)) {
                                            const id = utils_1.findFirstIdentifierFromMemberExpression(ary);
                                            if (t.isIdentifier(id)) {
                                                this.referencedIdentifiers.add(id);
                                            }
                                        }
                                        else if (t.isIdentifier(ary)) {
                                            const parentCallExpr = callExpr.find(p => p.isCallExpression());
                                            if (!utils_1.isArrayMapCallExpression(parentCallExpr) && parentCallExpr !== callExpr) {
                                                this.referencedIdentifiers.add(ary);
                                            }
                                        }
                                        const block = jsx_1.buildBlockElement();
                                        const hasIfAttr = jsxElementPath.node.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.if);
                                        const needWrapper = "swan" /* swan */ === adapter_1.Adapter.type && hasIfAttr;
                                        if (needWrapper) {
                                            block.children = [jsxElementPath.node];
                                            jsxElementPath.replaceWith(block);
                                        }
                                        jsx_1.setJSXAttr(needWrapper ? block : jsxElementPath.node, adapter_1.Adapter.for, t.jSXExpressionContainer(ary));
                                        this.loopCalleeId.add(utils_1.findFirstIdentifierFromMemberExpression(callee));
                                        const [func] = callExpr.node.arguments;
                                        if (t.isFunctionExpression(func) ||
                                            t.isArrowFunctionExpression(func)) {
                                            const [item, index] = func.params;
                                            let itemName = '';
                                            let indexName = '';
                                            if (t.isIdentifier(item)) {
                                                if ("quickapp" /* quickapp */ !== adapter_1.Adapter.type) {
                                                    jsx_1.setJSXAttr(needWrapper ? block : jsxElementPath.node, adapter_1.Adapter.forItem, t.stringLiteral(item.name));
                                                }
                                                else {
                                                    itemName = item.name;
                                                }
                                                this.loopScopes.add(item.name);
                                            }
                                            else if (t.isObjectPattern(item)) {
                                                throw utils_1.codeFrameError(item.loc, 'JSX map 循环参数暂时不支持使用 Object pattern 解构。');
                                            }
                                            else {
                                                jsx_1.setJSXAttr(needWrapper ? block : jsxElementPath.node, adapter_1.Adapter.forItem, t.stringLiteral('__item'));
                                                func.params[0] = t.identifier('__item');
                                            }
                                            if (t.isIdentifier(index)) {
                                                if ("quickapp" /* quickapp */ !== adapter_1.Adapter.type) {
                                                    jsx_1.setJSXAttr(needWrapper ? block : jsxElementPath.node, adapter_1.Adapter.forIndex, t.stringLiteral(index.name));
                                                }
                                                else {
                                                    indexName = index.name;
                                                }
                                                this.loopScopes.add(index.name);
                                                // tslint:disable-next-line: strict-type-predicates
                                            }
                                            else if (index === undefined) {
                                                if (process.env.NODE_ENV !== 'test') {
                                                    const uid = this.renderScope.generateUid('anonIdx');
                                                    func.params[1] = t.identifier(uid);
                                                    jsx_1.setJSXAttr(needWrapper ? block : jsxElementPath.node, adapter_1.Adapter.forIndex, t.stringLiteral(this.renderScope.generateUid('anonIdx')));
                                                }
                                            }
                                            else {
                                                throw utils_1.codeFrameError(index, '包含 JSX 的 map 循环第二个参数只能是一个普通标识符');
                                            }
                                            if ("quickapp" /* quickapp */ === adapter_1.Adapter.type) {
                                                if (itemName || indexName) {
                                                    const code = jsx_1.generateJSXAttr(ary);
                                                    let forExpr;
                                                    if (itemName && !indexName) {
                                                        forExpr = `${itemName} in ${code}`;
                                                    }
                                                    else {
                                                        forExpr = `(${indexName}, ${itemName}) in ${code}`;
                                                    }
                                                    jsx_1.setJSXAttr(jsxElementPath.node, adapter_1.Adapter.for, t.stringLiteral(`{{${forExpr}}}`));
                                                }
                                                // if (itemName && !indexName) {
                                                //   const forExpr = gene
                                                // }
                                            }
                                            this.loopComponents.set(callExpr, jsxElementPath);
                                            let loopComponentName;
                                            const parentCallee = callExpr.findParent(c => utils_1.isArrayMapCallExpression(c));
                                            if (utils_1.isArrayMapCallExpression(parentCallee)) {
                                                loopComponentName = `${constant_1.LOOP_CALLEE}_${this.incrementCalleeId()}`;
                                            }
                                            else {
                                                loopComponentName = 'loopArray' + this.loopArrayId();
                                            }
                                            this.loopComponentNames.set(callExpr, loopComponentName);
                                            // caller.replaceWith(jsxElementPath.node)
                                            if (statementParent) {
                                                const name = utils_1.findIdentifierFromStatement(statementParent.node);
                                                // setTemplate(name, path, templates)
                                                name && this.templates.set(name, jsxElementPath.node);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (t.isArrowFunctionExpression(parentNode)) {
                            parentPath.replaceWith(t.arrowFunctionExpression(parentNode.params, t.blockStatement([
                                t.returnStatement(jsxElementPath.node)
                            ])));
                        }
                    });
                }
            }
        };
        this.renameIfScopeVaribale = (blockStatement) => {
            return {
                VariableDeclarator: (path) => {
                    const { id, init } = path.node;
                    const ifStem = path.parentPath.parentPath.parentPath;
                    if (!ifStem.isIfStatement() || utils_1.isContainJSXElement(path)) {
                        return;
                    }
                    if (t.isIdentifier(id)) {
                        if (id.name.startsWith('loopArray') || id.name.startsWith(constant_1.LOOP_CALLEE)) {
                            this.renderPath.node.body.body.unshift(t.variableDeclaration('let', [t.variableDeclarator(t.identifier(id.name))]));
                            path.parentPath.replaceWith(template('ID = INIT;')({ ID: t.identifier(id.name), INIT: init }));
                        }
                        else if (id.name.startsWith('$props__')) {
                            path.skip();
                        }
                        else {
                            const newId = this.renderScope.generateDeclaredUidIdentifier('$' + id.name);
                            blockStatement.scope.rename(id.name, newId.name);
                            path.parentPath.replaceWith(template('ID = INIT;')({ ID: newId, INIT: init || t.identifier('undefined') }));
                        }
                    }
                },
                JSXElement: (jsxElementPath) => {
                    this.handleJSXElement(jsxElementPath, (options) => {
                        this.handleConditionExpr(options, jsxElementPath);
                    });
                },
                JSXExpressionContainer: this.replaceIdWithTemplate(true)
            };
        };
        this.findParallelIfStem = (p) => {
            const exprs = new Set();
            let expr = p.parentPath;
            while (expr.isIfStatement()) {
                exprs.add(expr);
                expr = expr.parentPath;
            }
            return exprs;
        };
        this.insertElseBlock = (block, jsx, test) => {
            if (this.isEmptyBlock(block)) {
                return;
            }
            for (const child of block.children) {
                if (!t.isJSXElement(child)) {
                    continue;
                }
                const ifAttr = child.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.if);
                const ifElseAttr = child.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.elseif);
                if ((ifAttr && t.isJSXExpressionContainer(ifAttr.value, { expression: test }))
                    ||
                        (ifElseAttr && t.isJSXExpressionContainer(ifElseAttr.value, { expression: test }))) {
                    block.children.push(jsx);
                    break;
                }
                else {
                    this.insertElseBlock(child, jsx, test);
                }
            }
        };
        this.handleNestedIfStatement = (block, jsx, test, hasNest, isElse) => {
            if (this.isEmptyBlock(block)) {
                return;
            }
            for (const [index, child] of block.children.entries()) {
                if (!t.isJSXElement(child)) {
                    continue;
                }
                const ifAttr = child.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.if);
                const ifElseAttr = child.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.elseif);
                if ((ifAttr && t.isJSXExpressionContainer(ifAttr.value, { expression: test }))
                    ||
                        (ifElseAttr && t.isJSXExpressionContainer(ifElseAttr.value, { expression: test }))) {
                    if (isElse) {
                        const nextChild = block.children[index + 1];
                        if (t.isJSXElement(nextChild)) {
                            nextChild.children.push(jsx);
                        }
                    }
                    else {
                        child.children.push(jsx);
                    }
                    hasNest = true;
                    break;
                }
                else {
                    this.handleNestedIfStatement(child, jsx, test, hasNest, isElse);
                }
            }
        };
        this.isEmptyBlock = ((block) => block.children.length === 0 && block.openingElement.attributes.length === 0);
        this.prefixExpr = () => this.isDefaultRender ? t.identifier('__prefix') : t.identifier(constant_1.CLASS_COMPONENT_UID);
        this.propsDecls = new Map();
        this.isInternalComponent = (element) => {
            return t.isJSXIdentifier(element.name) &&
                !constant_1.DEFAULT_Component_SET.has(element.name.name) &&
                !constant_1.DEFAULT_Component_SET_COPY.has(element.name.name) &&
                /[A-Z]/.test(element.name.name.charAt(0));
        };
        this.jsxElementVisitor = {
            JSXElement: (jsxElementPath) => {
                this.handleJSXElement(jsxElementPath, (options) => {
                    this.handleConditionExpr(options, jsxElementPath);
                    this.handleJSXInIfStatement(jsxElementPath, options);
                });
                // handle jsx attrs
                jsxElementPath.traverse(this.jsxAttrVisitor);
            }
        };
        this.jsxAttrVisitor = {
            JSXExpressionContainer: (path) => {
                if (!isChildrenOfJSXAttr(path)) {
                    return;
                }
                const expression = path.get('expression');
                if (expression.isStringLiteral()) {
                    path.replaceWith(expression);
                }
                else if (expression.isCallExpression()) {
                    const node = expression.node;
                    if (t.isMemberExpression(node.callee) &&
                        t.isIdentifier(node.callee.property) &&
                        node.callee.property.name === 'bind') {
                        const JSXElement = path.findParent(p => p.isJSXElement())
                            .node;
                        const componentName = JSXElement.openingElement.name;
                        if (adapter_1.isNewPropsSystem() &&
                            t.isJSXIdentifier(componentName)) {
                            if (constant_1.THIRD_PARTY_COMPONENTS.has(componentName.name)) {
                                //
                            }
                            else if (!constant_1.DEFAULT_Component_SET.has(componentName.name)) {
                                return;
                            }
                        }
                        // const JSXAttribute = path.findParent(p => p.isJSXAttribute())
                        let bindCalleeName = null;
                        if (t.isIdentifier(node.callee.object)) {
                            bindCalleeName = node.callee.object.name;
                        }
                        else if (t.isMemberExpression(node.callee.object)) {
                            if (t.isIdentifier(node.callee.object.property)) {
                                bindCalleeName = node.callee.object.property.name;
                            }
                        }
                        if (bindCalleeName !== null) {
                            const attr = path.parentPath.node;
                            let bindEventName = attr.name.name;
                            bindEventName = bindEventName.replace(/^bind|^catch/, '');
                            const args = expression.get('arguments');
                            args.forEach((arg, index) => {
                                const node = arg.node;
                                const argName = babel_generator_1.default(node).code;
                                if (index === 0) {
                                    jsx_1.setJSXAttr(JSXElement, `data-e-${bindEventName}-so`, t.stringLiteral(argName));
                                }
                                else {
                                    let expr = null;
                                    if (t.isIdentifier(node) && path.scope.hasBinding(argName)) {
                                        this.addRefIdentifier(path, node);
                                        expr = t.jSXExpressionContainer(node);
                                    }
                                    else if (t.isMemberExpression(node)) {
                                        const id = utils_1.findFirstIdentifierFromMemberExpression(node);
                                        this.addRefIdentifier(path, id);
                                        expr = t.jSXExpressionContainer(node);
                                    }
                                    else if (node.type === 'NumericLiteral' || t.isStringLiteral(node) || t.isBooleanLiteral(node) || t.isNullLiteral(node)) {
                                        expr = t.jSXExpressionContainer(node);
                                    }
                                    else if (utils_1.hasComplexExpression(arg)) {
                                        const isCookedLoop = JSXElement.openingElement.attributes.some(attr => attr.name.name === adapter_1.Adapter.for);
                                        if (isCookedLoop) {
                                            throw utils_1.codeFrameError(arg.node, '在循环中使用 bind 时，需要声明将此复杂表达式声明为一个变量再放入 bind 参数中。');
                                        }
                                        else {
                                            const id = utils_1.generateAnonymousState(this.renderScope, arg, this.referencedIdentifiers);
                                            expr = t.jSXExpressionContainer(id);
                                        }
                                    }
                                    else {
                                        expr = t.jSXExpressionContainer(t.identifier(argName));
                                    }
                                    jsx_1.setJSXAttr(JSXElement, `data-e-${bindEventName}-a-${utils_1.toLetters(index)}`, expr);
                                }
                            });
                            expression.replaceWith(t.stringLiteral(`${bindCalleeName}`));
                        }
                    }
                }
            },
            JSXAttribute: (path) => {
                const { name, value } = path.node;
                let eventShouldBeCatched = false;
                const jsxElementPath = path.parentPath.parentPath;
                if (t.isJSXIdentifier(name) && jsxElementPath.isJSXElement()) {
                    const componentName = jsxElementPath.node.openingElement.name.name;
                    const isThirdPartyKey = name.name === 'taroKey';
                    if (name.name === 'key' || isThirdPartyKey) {
                        if (constant_1.THIRD_PARTY_COMPONENTS.has(componentName) && !isThirdPartyKey) {
                            return;
                        }
                        const jsx = path.findParent(p => p.isJSXElement());
                        const loopBlock = jsx.findParent(p => {
                            if (p.isJSXElement()) {
                                const element = p.get('openingElement');
                                if (element.get('name').isJSXIdentifier({ name: 'block' })) {
                                    const attrs = element.node.attributes;
                                    const hasWXForLoop = attrs.some(attr => t.isJSXIdentifier(attr.name, { name: adapter_1.Adapter.for }));
                                    const hasWXKey = attrs.some(attr => t.isJSXIdentifier(attr.name, { name: adapter_1.Adapter.key }));
                                    return hasWXForLoop && !hasWXKey;
                                }
                            }
                            return false;
                        });
                        if (loopBlock) {
                            jsx_1.setJSXAttr(loopBlock.node, adapter_1.Adapter.key, value);
                            path.remove();
                        }
                        else {
                            path.get('name').replaceWith(t.jSXIdentifier(adapter_1.Adapter.key));
                        }
                    }
                    else if (name.name.startsWith('on')) {
                        if (t.isJSXExpressionContainer(value)) {
                            const methodName = utils_1.findMethodName(value.expression);
                            methodName && this.usedEvents.add(methodName);
                            const method = this.methods.get(methodName);
                            const classDecl = path.findParent(p => p.isClassDeclaration());
                            const componentName = jsxElementPath.node.openingElement.name;
                            // if (method && t.isIdentifier(method.node.key)) {
                            //   this.usedEvents.add(methodName)
                            // } else if (method === null) {
                            //   this.usedEvents.add(methodName)
                            // }
                            if (!babel_generator_1.default(value.expression).code.includes('.bind') &&
                                (!adapter_1.isNewPropsSystem() ||
                                    (t.isJSXIdentifier(componentName) && constant_1.DEFAULT_Component_SET.has(componentName.name)))) {
                                path.node.value = t.stringLiteral(`${methodName}`);
                            }
                            if (this.methods.has(methodName)) {
                                eventShouldBeCatched = utils_1.isContainStopPropagation(method);
                            }
                            if (classDecl && classDecl.isClassDeclaration()) {
                                const superClass = utils_1.getSuperClassCode(classDecl);
                                if (superClass) {
                                    try {
                                        const ast = babel_core_1.transform(superClass.code, options_1.buildBabelTransformOptions()).ast;
                                        babel_traverse_1.default(ast, {
                                            ClassMethod(p) {
                                                if (!p.get('key').isIdentifier({ name: methodName })) {
                                                    return;
                                                }
                                                eventShouldBeCatched = utils_1.isContainStopPropagation(method);
                                            },
                                            ClassProperty(p) {
                                                if (!p.get('key').isIdentifier({ name: methodName })) {
                                                    return;
                                                }
                                                eventShouldBeCatched = utils_1.isContainStopPropagation(method);
                                            }
                                        });
                                    }
                                    catch (error) {
                                        //
                                    }
                                }
                            }
                            if (t.isJSXIdentifier(componentName) && !constant_1.DEFAULT_Component_SET.has(componentName.name)) {
                                const element = path.parent;
                                if (process.env.NODE_ENV !== 'test' && adapter_1.Adapter.type !== "alipay" /* alipay */) {
                                    const fnName = `${constant_1.FN_PREFIX}${name.name}`;
                                    element.attributes = element.attributes.concat([t.jSXAttribute(t.jSXIdentifier(fnName))]);
                                }
                            }
                        }
                        if (t.isJSXIdentifier(jsxElementPath.node.openingElement.name)) {
                            const componentName = jsxElementPath.node.openingElement.name.name;
                            if (adapter_1.Adapter.type === "alipay" /* alipay */) {
                                let transformName = name.name;
                                if (constant_1.DEFAULT_Component_SET.has(componentName) && constant_1.ALIPAY_BUBBLE_EVENTS.has(name.name)) {
                                    if (name.name === 'onClick') {
                                        transformName = eventShouldBeCatched ? 'catchTap' : 'onTap';
                                    }
                                    else {
                                        transformName = `${eventShouldBeCatched ? 'catch' : 'on'}${name.name.slice(2)}`;
                                    }
                                }
                                path.node.name = t.jSXIdentifier(transformName);
                            }
                            else if (adapter_1.Adapter.type === "quickapp" /* quickapp */) {
                                const transformName = name.name;
                                path.node.name = t.jSXIdentifier(transformName);
                            }
                            else if (constant_1.DEFAULT_Component_SET.has(componentName)) {
                                let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}`
                                    + name.name.slice(2).toLowerCase();
                                if (name.name === 'onClick') {
                                    transformName = eventShouldBeCatched ? 'catchtap' : 'bindtap';
                                }
                                path.node.name = t.jSXIdentifier(transformName);
                            }
                            else if (constant_1.THIRD_PARTY_COMPONENTS.has(componentName)) {
                                path.node.name = t.jSXIdentifier('bind' + name.name[2].toLowerCase() + name.name.slice(3));
                            }
                            else {
                                path.node.name = t.jSXIdentifier('bind' + name.name.toLowerCase());
                            }
                        }
                        // let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}` + name.name.slice(2, name.name.length)
                        // transformName = eventShouldBeCatched
                        //   ? CATCH_EVENT_MAP.get(name.name)!
                        //   : BIND_EVENT_MAP.get(name.name)!
                    }
                    else if (/^render[A-Z]/.test(name.name) && !constant_1.DEFAULT_Component_SET.has(componentName)) {
                        if (!t.isJSXExpressionContainer(value)) {
                            throw utils_1.codeFrameError(value, '以 render 开头的 props 只能传入包含一个 JSX 元素的 JSX 表达式。');
                        }
                        const expression = value.expression;
                        if (!t.isJSXElement(expression)) {
                            throw utils_1.codeFrameError(value, '以 render 开头的 props 只能传入包含一个 JSX 元素的 JSX 表达式。');
                        }
                        const slotName = utils_1.getSlotName(name.name);
                        const slot = lodash_1.cloneDeep(expression);
                        const view = t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('View'), []), t.jSXClosingElement(t.jSXIdentifier('View')), []);
                        view.children.push(slot);
                        jsx_1.setJSXAttr(view, 'slot', t.stringLiteral(slotName));
                        jsxElementPath.node.children.push(view);
                        path.remove();
                    }
                }
            },
            Identifier: (path) => {
                if (!isChildrenOfJSXAttr(path)) {
                    return;
                }
                if (!path.isReferencedIdentifier()) {
                    return;
                }
                const parentPath = path.parentPath;
                if (parentPath.isConditionalExpression() ||
                    parentPath.isLogicalExpression() ||
                    parentPath.isJSXExpressionContainer() ||
                    parentPath.isBinaryExpression() ||
                    this.renderScope.hasOwnBinding(path.node.name)) {
                    this.addRefIdentifier(path, path.node);
                }
            },
            MemberExpression: {
                exit: (path) => {
                    const { object, property } = path.node;
                    if (!path.isReferencedMemberExpression()) {
                        return;
                    }
                    if (!t.isThisExpression(object)) {
                        return;
                    }
                    const reserves = new Set([
                        'state',
                        'props',
                        ...this.methods.keys()
                    ]);
                    if (t.isIdentifier(property) || t.isMemberExpression(property)) {
                        const id = t.isIdentifier(property) ? property : utils_1.findFirstIdentifierFromMemberExpression(property);
                        if (reserves.has(id.name)) {
                            return;
                        }
                        const jsxAttr = path.findParent(p => p.isJSXAttribute());
                        if (jsxAttr && t.isJSXIdentifier(jsxAttr.node.name) && jsxAttr.node.name.name.startsWith('on')) {
                            return;
                        }
                        if (t.isIdentifier(id) && !(id.name.startsWith('_create') && id.name.endsWith('Data'))) {
                            this.referencedIdentifiers.add(id);
                            this.usedThisProperties.add(id.name);
                        }
                    }
                },
                enter: (path) => {
                    if (!isChildrenOfJSXAttr(path)) {
                        return;
                    }
                    if (!path.isReferencedMemberExpression() || path.parentPath.isMemberExpression()) {
                        return;
                    }
                    const { object, property } = path.node;
                    if (t.isMemberExpression(object) &&
                        t.isThisExpression(object.object) &&
                        t.isIdentifier(object.property, { name: 'state' })) {
                        if (t.isIdentifier(property)) {
                            this.usedThisState.add(property.name);
                        }
                        else if (t.isMemberExpression(property)) {
                            const id = utils_1.findFirstIdentifierFromMemberExpression(property);
                            if (id && this.renderScope.hasBinding(id.name)) {
                                this.usedThisState.add(id.name);
                            }
                        }
                        return;
                    }
                    const code = babel_generator_1.default(path.node).code;
                    if (code.includes('this.$router.params') && t.isIdentifier(property)) {
                        const name = this.renderScope.generateUid(property.name);
                        const dcl = utils_1.buildConstVariableDeclaration(name, path.node);
                        this.renderPath.node.body.body.unshift(dcl);
                        path.replaceWith(t.identifier(name));
                    }
                    const parentPath = path.parentPath;
                    const id = utils_1.findFirstIdentifierFromMemberExpression(path.node);
                    if (t.isThisExpression(id)) {
                        return;
                    }
                    if (parentPath.isConditionalExpression() ||
                        parentPath.isLogicalExpression() ||
                        parentPath.isJSXExpressionContainer() ||
                        parentPath.isBinaryExpression() ||
                        (this.renderScope.hasOwnBinding(id.name))) {
                        this.addRefIdentifier(path, id);
                    }
                }
            },
            ArrowFunctionExpression: (path) => {
                if (!isChildrenOfJSXAttr(path)) {
                    return;
                }
                const uid = path.scope.generateUid('_anonymous_function_');
                const c = t.classProperty(t.identifier(uid), path.node);
                this.classProperties.add(c);
            }
        };
        this.visitors = Object.assign(Object.assign({ MemberExpression: (path) => {
                const { object, property } = path.node;
                if (t.isThisExpression(object) && t.isIdentifier(property) && property.name.startsWith('renderClosure')) {
                    const parentPath = path.parentPath;
                    if (parentPath.isVariableDeclarator()) {
                        const id = parentPath.node.id;
                        if (t.isIdentifier(id) && id.name.startsWith('renderClosure')) {
                            this.deferedHandleClosureJSXFunc.push(() => {
                                const classMethod = this.methods.get(id.name);
                                if (classMethod && classMethod.isClassMethod()) {
                                    path.replaceWith(t.arrowFunctionExpression([t.identifier(constant_1.CLASS_COMPONENT_UID)], t.blockStatement([
                                        t.returnStatement(t.arrowFunctionExpression(classMethod.node.params, classMethod.node.body))
                                    ])));
                                    // classMethod.node.body.body = []
                                }
                            });
                        }
                    }
                }
                if (t.isThisExpression(object) && t.isIdentifier(property) && /^render[A-Z]/.test(this.renderMethodName)) {
                    const s = new Set(['state', 'props']);
                    if (s.has(property.name) && path.parentPath.isMemberExpression()) {
                        const p = path.parentPath.node.property;
                        let id = { name: 'example' };
                        if (t.isIdentifier(p)) {
                            id = p;
                        }
                        else if (t.isMemberExpression(p)) {
                            id = utils_1.findFirstIdentifierFromMemberExpression(p);
                        }
                        // tslint:disable-next-line: no-console
                        console.warn(utils_1.codeFrameError(path.parentPath.node, `\n 在形如以 render 开头的 ${this.renderMethodName}() 类函数中，请先把 this.${property.name} 解构出来才进行使用。\n 例如： const { ${id.name} } = this.${property.name}`).message);
                    }
                }
            }, VariableDeclarator: (path) => {
                const init = path.get('init');
                const id = path.get('id');
                const ifStem = init.findParent(p => p.isIfStatement());
                // tslint:disable-next-line: strict-type-predicates
                if (ifStem && init.node === null) {
                    init.replaceWith(t.identifier('undefined'));
                }
                let isDerivedFromState = false;
                if (init.isMemberExpression()) {
                    const object = init.get('object');
                    if (object.isMemberExpression() && object.get('object').isThisExpression() && object.get('property').isIdentifier({ name: 'state' })) {
                        isDerivedFromState = true;
                    }
                    if (object.isThisExpression() && init.get('property').isIdentifier({ name: 'state' })) {
                        isDerivedFromState = true;
                    }
                }
                if (!isDerivedFromState) {
                    const errMsg = 'Warning: render 函数定义一个不从 this.state 解构或赋值而来的变量，此变量又与 this.state 下的变量重名可能会导致无法渲染。';
                    if (id.isIdentifier()) {
                        const name = id.node.name;
                        if (this.initState.has(name)) {
                            // tslint:disable-next-line
                            console.log(utils_1.codeFrameError(id.node, errMsg).message);
                        }
                    }
                    if (id.isObjectPattern()) {
                        const { properties } = id.node;
                        for (const p of properties) {
                            if (t.isIdentifier(p)) {
                                if (this.initState.has(p.name)) {
                                    // tslint:disable-next-line
                                    console.log(utils_1.codeFrameError(id.node, errMsg).message);
                                }
                            }
                            if (t.isSpreadProperty(p) && t.isIdentifier(p.argument)) {
                                if (this.initState.has(p.argument.name)) {
                                    // tslint:disable-next-line
                                    console.log(utils_1.codeFrameError(id.node, errMsg).message);
                                }
                            }
                        }
                    }
                }
            }, JSXEmptyExpression(path) {
                const parent = path.parentPath;
                if (path.parentPath.isJSXExpressionContainer()) {
                    parent.remove();
                }
            },
            NullLiteral(path) {
                const statementParent = path.getStatementParent();
                const callExprs = findParents(path, p => p.isCallExpression());
                if (callExprs.some(callExpr => callExpr && t.isIdentifier(callExpr.node.callee) && /^use[A-Z]/.test(callExpr.node.callee.name))) {
                    return;
                }
                if (statementParent && statementParent.isReturnStatement() && !t.isBinaryExpression(path.parent) && !isChildrenOfJSXAttr(path)) {
                    path.replaceWith(t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('View'), []), undefined, [], true));
                }
            }, ReturnStatement: (path) => {
                const parentPath = path.parentPath;
                if (parentPath.parentPath.isClassMethod() ||
                    (parentPath.parentPath.isIfStatement() && parentPath.parentPath.parentPath.isClassMethod())) {
                    this.replaceIdWithTemplate()(path);
                }
            } }, this.jsxElementVisitor), { JSXExpressionContainer: this.replaceIdWithTemplate(true) });
        this.quickappVistor = {
            JSXExpressionContainer(path) {
                if (path.parentPath.isJSXAttribute() || utils_1.isContainJSXElement(path)) {
                    return;
                }
                utils_1.replaceJSXTextWithTextComponent(path);
            }
        };
        this.isEmptyProps = (attrs) => attrs.filter(a => {
            if (t.isJSXSpreadAttribute(a))
                return true;
            const list = [adapter_1.Adapter.for, adapter_1.Adapter.forIndex, adapter_1.Adapter.forItem, 'id'];
            adapter_1.Adapter.type === "weapp" /* weapp */ && list.push('extraProps');
            return !list.includes(a.name.name);
        }).length === 0;
        /**
         * jsxDeclarations,
         * renderScope,
         * methods,
         * loopScopes,
         * initState,
         * templates
         */
        this.handleLoopComponents = () => {
            const replaceQueue = [];
            let hasLoopRef = false;
            this.loopComponents.forEach((component, callee) => {
                if (!callee.isCallExpression()) {
                    return;
                }
                if (this.loopIfStemComponentMap.has(callee)) {
                    const block = this.loopIfStemComponentMap.get(callee);
                    const attrs = component.node.openingElement.attributes;
                    const wxForDirectives = new Set([adapter_1.Adapter.for, adapter_1.Adapter.forIndex, adapter_1.Adapter.forItem]);
                    const ifAttrs = attrs.filter(a => wxForDirectives.has(a.name.name));
                    if (ifAttrs.length) {
                        block.openingElement.attributes.push(...ifAttrs);
                        component.node.openingElement.attributes = attrs.filter(a => !wxForDirectives.has(a.name.name));
                    }
                    jsx_1.setJSXAttr(component.node, adapter_1.Adapter.else);
                    block.children.push(component.node);
                    component.replaceWith(block);
                }
                for (const dcl of this.jsxDeclarations) {
                    const isChildren = dcl && dcl.findParent(d => d === callee);
                    if (isChildren) {
                        this.jsxDeclarations.delete(dcl);
                        dcl.remove();
                    }
                }
                const blockStatementPath = component.findParent(p => p.isBlockStatement());
                const body = blockStatementPath.node.body;
                let loopRefComponent = null;
                this.loopRefs.forEach((ref, jsx) => {
                    if (ref.component.findParent(p => p === component)) {
                        loopRefComponent = jsx;
                    }
                });
                const [func] = callee.node.arguments;
                let indexId = null;
                let itemId = null;
                if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
                    const params = func.params;
                    if (Array.isArray(params)) {
                        indexId = params[1];
                        itemId = params[0];
                    }
                }
                if (this.loopRefs.has(component.node) || loopRefComponent) {
                    hasLoopRef = true;
                    const ref = this.loopRefs.get(component.node) || this.loopRefs.get(loopRefComponent);
                    if (indexId === null || !t.isIdentifier(indexId)) {
                        throw utils_1.codeFrameError(component.node, '在循环中使用 ref 必须暴露循环的第二个参数 `index`');
                    }
                    const id = typeof ref.id === 'string' ? t.binaryExpression('+', t.stringLiteral(ref.id), indexId) : ref.id;
                    const args = [
                        t.identifier('__scope'),
                        t.binaryExpression('+', t.stringLiteral('#'), id)
                    ];
                    if (ref.type === 'component') {
                        args.push(t.stringLiteral('component'));
                    }
                    else {
                        args.push(t.stringLiteral('dom'));
                    }
                    args.push(ref.fn);
                    const callHandleLoopRef = t.callExpression(t.identifier(constant_1.HANDLE_LOOP_REF), args);
                    const loopRefStatement = t.expressionStatement(t.logicalExpression('&&', t.logicalExpression('&&', t.identifier('__scope'), t.identifier('__isRunloopRef')), callHandleLoopRef));
                    body.splice(body.length - 1, 0, !env_1.isTestEnv ? loopRefStatement : t.expressionStatement(callHandleLoopRef));
                }
                if (adapter_1.isNewPropsSystem()) {
                    const loopIndices = this.findParentIndices(callee, indexId);
                    const deferCallBack = [];
                    blockStatementPath.traverse({
                        CallExpression(path) {
                            const pathCallee = path.node.callee;
                            if (t.isMemberExpression(pathCallee) &&
                                t.isThisExpression(pathCallee.object) &&
                                t.isIdentifier(pathCallee.property) &&
                                pathCallee.property.name.startsWith('_create') &&
                                pathCallee.property.name.endsWith('Data')) {
                                const arg = path.node.arguments[0];
                                if (t.isBinaryExpression(arg)) {
                                    deferCallBack.push(() => {
                                        path.node.arguments = [
                                            t.binaryExpression('+', arg, t.templateLiteral([
                                                t.templateElement({ raw: '' }),
                                                ...loopIndices.map(() => t.templateElement({ raw: '' }))
                                            ], loopIndices.map(l => t.identifier(l))))
                                        ];
                                    });
                                }
                            }
                        },
                        JSXElement: path => {
                            const element = path.node.openingElement;
                            if (this.isInternalComponent(element)) {
                                if (this.isEmptyProps(element.attributes)) {
                                    return;
                                }
                                // createData 函数里加入 compid 相关逻辑
                                const compid = utils_1.genCompid();
                                const prevVariableName = `${constant_1.PREV_COMPID}__${compid}`;
                                const variableName = `${constant_1.COMPID}__${compid}`;
                                const tpmlExprs = [];
                                for (let index = 0; index < loopIndices.length; index++) {
                                    const element = loopIndices[index];
                                    tpmlExprs.push(t.identifier(element));
                                    if (loopIndices[index + 1]) {
                                        tpmlExprs.push(t.stringLiteral('-'));
                                    }
                                }
                                const compidTempDecl = t.variableDeclaration('const', [
                                    t.variableDeclarator(t.arrayPattern([t.identifier(prevVariableName), t.identifier(variableName)]), t.callExpression(t.identifier(constant_1.GEN_COMP_ID), [t.templateLiteral([
                                            t.templateElement({ raw: '' }),
                                            t.templateElement({ raw: utils_1.createRandomLetters(10) }),
                                            ...tpmlExprs.map(() => t.templateElement({ raw: '' }))
                                        ], [
                                            this.prefixExpr(),
                                            ...tpmlExprs
                                        ]), t.booleanLiteral(true)]))
                                ]);
                                const properties = this.getPropsFromAttrs(element);
                                const propsSettingExpr = this.genPropsSettingExpression(properties, t.identifier(variableName), t.identifier(prevVariableName));
                                const expr = utils_1.setAncestorCondition(path, propsSettingExpr);
                                this.ancestorConditions.add(expr);
                                body.splice(body.length - 1, 0, compidTempDecl, t.expressionStatement(expr));
                                // wxml 组件打上 compid
                                const [func] = callee.node.arguments;
                                let forItem = null;
                                if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
                                    forItem = func.params[0];
                                }
                                if (forItem === null || !t.isIdentifier(forItem)) {
                                    throw utils_1.codeFrameError(callee.node, '在循环中使用自定义组件时必须暴露循环的第一个参数 `item`');
                                }
                                element.attributes.push(t.jSXAttribute(t.jSXIdentifier('compid'), t.jSXExpressionContainer(t.memberExpression(forItem, t.identifier(variableName)))));
                            }
                        }
                    });
                    deferCallBack.forEach(cb => cb());
                }
                let stateToBeAssign = new Set(lodash_1.difference(Object.keys(blockStatementPath.scope.getAllBindings()), Object.keys(this.renderScope.getAllBindings())).filter(i => {
                    return !this.methods.has(i);
                })
                    .filter(i => !this.loopScopes.has(i))
                    .filter(i => !this.initState.has(i))
                    .filter(i => !this.templates.has(i))
                    .filter(i => !i.includes('.'))
                    .filter(i => i !== constant_1.MAP_CALL_ITERATOR));
                if (body.length > 1) {
                    const [func] = callee.node.arguments;
                    if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
                        const [item, indexParam] = func.params;
                        const parents = findParents(callee, (p) => utils_1.isArrayMapCallExpression(p));
                        const iterators = new Set([item.name, ...parents
                                .map((p) => lodash_1.get(p, 'node.arguments[0].params[0].name', ''))
                                .filter(Boolean)]);
                        for (const [index, statement] of body.entries()) {
                            if (t.isVariableDeclaration(statement)) {
                                for (const dcl of statement.declarations) {
                                    if (t.isIdentifier(dcl.id)) {
                                        const name = dcl.id.name;
                                        if (name.startsWith(constant_1.LOOP_STATE) ||
                                            name.startsWith(constant_1.LOOP_CALLEE) ||
                                            name.startsWith(constant_1.COMPID) ||
                                            name.startsWith('_$indexKey')) {
                                            stateToBeAssign.add(name);
                                            dcl.id = t.identifier(name);
                                        }
                                    }
                                    else if (t.isArrayPattern(dcl.id)) {
                                        dcl.id.elements.forEach(stm => {
                                            if (t.isIdentifier(stm)) {
                                                const name = stm.name;
                                                if (name.startsWith(constant_1.LOOP_STATE) ||
                                                    name.startsWith(constant_1.LOOP_CALLEE) ||
                                                    name.startsWith(constant_1.COMPID) ||
                                                    name.startsWith('_$indexKey')) {
                                                    stateToBeAssign.add(name);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                            if (t.isReturnStatement(statement)) {
                                body.splice(index, 1);
                            }
                        }
                        stateToBeAssign.forEach(s => this.loopRefIdentifiers.set(s, callee));
                        const properties = Array.from(stateToBeAssign).map(state => t.objectProperty(t.identifier(state), t.identifier(state)));
                        // tslint:disable-next-line:no-inner-declarations
                        function replaceOriginal(path, parent, name) {
                            if ((path.isReferencedIdentifier() || t.isAssignmentExpression(parent)) &&
                                iterators.has(name) &&
                                !(t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: constant_1.LOOP_ORIGINAL })) &&
                                !(t.isMemberExpression(parent) && t.isIdentifier(parent.property) && (parent.property.name.startsWith(constant_1.LOOP_STATE) || parent.property.name.startsWith(constant_1.LOOP_CALLEE) || parent.property.name.startsWith(constant_1.COMPID)))) {
                                path.replaceWith(t.memberExpression(t.identifier(name), t.identifier(constant_1.LOOP_ORIGINAL)));
                            }
                        }
                        const bodyPath = callee.get('arguments')[0].get('body');
                        bodyPath.traverse({
                            Identifier(path) {
                                const name = path.node.name;
                                const parent = path.parent;
                                replaceOriginal(path, parent, name);
                            }
                        });
                        const replacements = new Set();
                        component.traverse({
                            JSXAttribute: !t.isIdentifier(indexParam) ? utils_1.noop : (path) => {
                                const { value } = path.node;
                                if (t.isJSXExpressionContainer(value) && t.isJSXIdentifier(path.node.name, { name: 'key' }) && t.isIdentifier(value.expression, { name: indexParam.name })) {
                                    if (process.env.TERM_PROGRAM || env_1.isTestEnv) { // 无法找到 cli 名称的工具（例如 idea/webstorm）显示这个报错可能会乱码
                                        // tslint:disable-next-line:no-console
                                        console.log(utils_1.codeFrameError(value.expression, '建议修改：使用循环的 index 变量作为 key 是一种反优化。参考：https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md').message);
                                    }
                                }
                            },
                            JSXExpressionContainer: this.replaceIdWithTemplate(),
                            Identifier: (path) => {
                                const name = path.node.name;
                                const parent = path.parent;
                                const parentCallExpr = path.findParent(p => p.isCallExpression());
                                if (replacements.has(parent) || (this.renderScope.hasOwnBinding(name) &&
                                    (this.loopCalleeId.has(path.node) || parentCallExpr && this.loopCalleeId.has(parentCallExpr.node)))) {
                                    return;
                                }
                                if (stateToBeAssign.has(name) && path.isReferencedIdentifier()) {
                                    if (t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: 'map' })) {
                                        const grandParentPath = path.parentPath.parentPath;
                                        if (grandParentPath.isCallExpression() && this.loopComponents.has(grandParentPath)) {
                                            return;
                                        }
                                    }
                                    if (path.findParent(p => this.loopCallees.has(p.node))) {
                                        return;
                                    }
                                    const parentCondition = path.findParent(p => p.isConditionalExpression() || p.isLogicalExpression());
                                    if (parentCondition) {
                                        const varDecl = parentCondition.findParent(p => p.isVariableDeclarator());
                                        if (varDecl && varDecl.isVariableDeclarator()) {
                                            const init = varDecl.node.id;
                                            if (t.isIdentifier(init) && init.name.startsWith(constant_1.LOOP_STATE)) {
                                                return;
                                            }
                                        }
                                        if (path.findParent(p => this.ancestorConditions.has(p.node))) {
                                            return;
                                        }
                                    }
                                    const replacement = t.memberExpression(t.identifier(item.name), path.node);
                                    path.replaceWith(replacement);
                                    replacements.add(replacement);
                                }
                                else {
                                    replaceOriginal(path, parent, name);
                                }
                            },
                            MemberExpression(path) {
                                const { object, property } = path.node;
                                if (t.isThisExpression(object) && t.isIdentifier(property)) {
                                    if (property.name === 'state' && path.parentPath.isMemberExpression() && path.parentPath.parentPath.isMemberExpression()) {
                                        // tslint:disable-next-line
                                        console.warn(utils_1.codeFrameError(path.parentPath.parentPath.node, `在循环中使用 this.state.xx.xx 可能会存在问题，请给 xx 起一个别名，例如 const { xx } = this.state`));
                                    }
                                }
                            }
                        });
                        const originalProp = t.objectProperty(t.identifier(constant_1.LOOP_ORIGINAL), t.memberExpression(t.identifier(item.name), t.identifier(constant_1.LOOP_ORIGINAL)));
                        properties.push(originalProp);
                        body.unshift(t.expressionStatement(t.assignmentExpression('=', t.identifier(item.name), t.objectExpression([
                            t.objectProperty(t.identifier(constant_1.LOOP_ORIGINAL), t.callExpression(t.identifier(constant_1.INTERNAL_GET_ORIGNAL), [t.identifier(item.name)]))
                        ]))));
                        const returnStatement = t.returnStatement(properties.length ? t.objectExpression(properties) : item);
                        const parentCallee = callee.findParent(c => utils_1.isArrayMapCallExpression(c));
                        if (utils_1.isArrayMapCallExpression(parentCallee)) {
                            const [func] = parentCallee.node.arguments;
                            const { object } = callee.node.callee;
                            if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
                                const funcBody = func.body;
                                if (t.isBlockStatement(funcBody)) {
                                    if (t.isIdentifier(object) || t.isMemberExpression(object)) {
                                        const variableName = this.loopComponentNames.get(callee);
                                        funcBody.body.splice(funcBody.body.length - 1, 0, utils_1.buildConstVariableDeclaration(variableName, utils_1.setParentCondition(component, callee.node, true)));
                                        const iterator = func.params[0];
                                        component.node.openingElement.attributes.forEach(attr => {
                                            if (attr.name.name === adapter_1.Adapter.for && t.isIdentifier(iterator)) {
                                                attr.value = t.jSXExpressionContainer(t.memberExpression(iterator, t.identifier(variableName)));
                                            }
                                        });
                                    }
                                    else {
                                        throw utils_1.codeFrameError(object.loc, '多层循环中循环的数组只能是一个变量或成员表达式，可以尝试把该表达式赋值给循环内部的一个新变量。');
                                    }
                                }
                            }
                            body.push(returnStatement);
                        }
                        else {
                            body.push(returnStatement);
                            const stateName = this.loopComponentNames.get(callee);
                            // setJSXAttr(returned, Adapter.for, t.identifier(stateName))
                            this.addRefIdentifier(callee, t.identifier(stateName));
                            // this.referencedIdentifiers.add(t.identifier(stateName))
                            if ("quickapp" /* quickapp */ === adapter_1.Adapter.type) {
                                let itemName = itemId.name;
                                let indexName = indexId.name;
                                if (itemName || indexName) {
                                    let forExpr;
                                    if (itemName && !indexName) {
                                        forExpr = `${itemName} in ${stateName}`;
                                    }
                                    else {
                                        forExpr = `(${indexName}, ${itemName}) in ${stateName}`;
                                    }
                                    jsx_1.setJSXAttr(component.node, adapter_1.Adapter.for, t.stringLiteral(`{{${forExpr}}}`));
                                }
                            }
                            else {
                                jsx_1.setJSXAttr(component.node, adapter_1.Adapter.for, t.jSXExpressionContainer(t.identifier(stateName)));
                            }
                            const returnBody = this.renderPath.node.body.body;
                            const ifStem = callee.findParent(p => p.isIfStatement());
                            // @TEST
                            if (ifStem && ifStem.isIfStatement()) {
                                const consequent = ifStem.get('consequent');
                                if (consequent.isBlockStatement()) {
                                    const assignment = t.expressionStatement(t.assignmentExpression('=', t.identifier(stateName), utils_1.setParentCondition(component, callee.node, true)));
                                    returnBody.unshift(t.variableDeclaration('let', [t.variableDeclarator(t.identifier(stateName))]));
                                    if (callee.findParent(p => p === consequent)) {
                                        consequent.node.body.push(assignment);
                                    }
                                    else {
                                        const alternate = ifStem.get('alternate');
                                        if (alternate.isBlockStatement()) {
                                            alternate.node.body.push(assignment);
                                        }
                                        else {
                                            consequent.node.body.push(assignment);
                                        }
                                    }
                                }
                            }
                            else {
                                const decl = utils_1.buildConstVariableDeclaration(stateName, utils_1.setParentCondition(component, callee.node, true));
                                returnBody.push(decl);
                            }
                        }
                    }
                }
                replaceQueue.push(() => {
                    const statement = component.getStatementParent();
                    callee.replaceWith(statement.isReturnStatement()
                        ? statement.get('argument').node
                        : component.node);
                });
            });
            if (hasLoopRef) {
                const scopeDecl = template('const __scope = this.$scope')();
                this.renderPath.node.body.body.unshift(scopeDecl);
            }
            replaceQueue.forEach(func => func());
        };
        this.setReserveWord = (word) => {
            const binding = this.renderScope.getOwnBinding(word);
            let hasStateId = false;
            if (binding) {
                const path = binding.path;
                const id = path.get('id');
                const init = path.get('init');
                if (init.isThisExpression()) {
                    return hasStateId;
                }
                if (id.isObjectPattern()) {
                    hasStateId = id.node.properties.some(p => {
                        return (t.isObjectProperty(p) && t.isIdentifier(p.key, { name: word }))
                            || (t.isRestProperty(p) && t.isIdentifier(p.argument, { name: word }));
                    });
                }
                else if (id.isIdentifier({ name: word })) {
                    hasStateId = true;
                }
                if (hasStateId) {
                    this.referencedIdentifiers.add(t.identifier(word));
                }
            }
            if (hasStateId) {
                this.reserveStateWords.delete(word);
            }
        };
        this.getCreateJSXMethodName = (name) => `_create${name.slice(6)}Data`;
        this.renderPath = renderPath;
        this.methods = methods;
        this.initState = initState;
        this.referencedIdentifiers = referencedIdentifiers;
        this.usedState = usedState;
        this.customComponentNames = customComponentNames;
        this.componentProperies = componentProperies;
        this.loopRefs = loopRefs;
        this.refObjExpr = refObjExpr;
        const renderBody = renderPath.get('body');
        this.renderScope = renderBody.scope;
        this.isDefaultRender = methodName === 'render';
        this.upperCaseComponentProps = new Set(Array.from(this.componentProperies).filter(p => /[A-Z]/.test(p) && !p.startsWith('on')));
        const [, error] = renderPath.node.body.body.filter(s => t.isReturnStatement(s));
        if (error) {
            throw utils_1.codeFrameError(error.loc, 'render 函数顶级作用域暂时只支持一个 return');
        }
        if (t.isIdentifier(this.renderPath.node.key)) {
            this.renderMethodName = this.renderPath.node.key.name;
        }
        else {
            throw utils_1.codeFrameError(this.renderPath.node, '类函数对象必须指明函数名');
        }
        this.handleQuickappProps();
        renderBody.traverse(this.loopComponentVisitor);
        if (this.hasNoReturnLoopStem) {
            renderBody.traverse({
                JSXElement: this.loopComponentVisitor.JSXElement.exit[0]
            });
        }
        this.handleLoopComponents();
        if (adapter_1.isNewPropsSystem()) {
            this.handleComponents(renderBody);
        }
        renderBody.traverse(this.visitors);
        if (adapter_1.Adapter.type === "quickapp" /* quickapp */) {
            renderBody.traverse(this.quickappVistor);
        }
        if (t.isIdentifier(this.renderPath.node.key)) {
            this.renderPath.node.key.name = this.getCreateJSXMethodName(this.renderMethodName);
        }
        this.setOutputTemplate();
        this.checkDuplicateName();
        this.removeJSXStatement();
        this.setUsedState();
        this.setPendingState();
        this.setCustomEvent();
        this.createData();
        if (adapter_1.Adapter.type === "quickapp" /* quickapp */) {
            this.setProperies();
        }
        this.setLoopRefFlag();
        this.handleClosureComp();
    }
    handleConditionExpr({ parentNode, parentPath, statementParent }, jsxElementPath) {
        if (parentPath.isObjectProperty()) {
            const value = parentPath.get('value');
            if (value !== jsxElementPath) {
                return;
            }
            if (!parentPath.parentPath.isObjectExpression()) {
                return;
            }
            const properties = parentPath.parentPath.get('properties');
            if (!parentPath.parentPath.parentPath.isMemberExpression()) {
                return;
            }
            const rval = parentPath.parentPath.parentPath.get('property');
            if (!rval || !rval.node || !Array.isArray(properties)) {
                return;
            }
            const children = properties.map(p => p.node).map((p, index) => {
                const block = jsx_1.buildBlockElement();
                const leftExpression = p.key;
                const tester = t.binaryExpression('===', leftExpression, rval.node);
                block.children = [t.jSXExpressionContainer(p.value)];
                if (index === 0) {
                    utils_1.newJSXIfAttr(block, tester);
                }
                else {
                    jsx_1.setJSXAttr(block, adapter_1.Adapter.elseif, t.jSXExpressionContainer(tester));
                }
                return block;
            });
            const block = jsx_1.buildBlockElement();
            block.children = children;
            parentPath.parentPath.parentPath.replaceWith(block);
        }
        else if (t.isLogicalExpression(parentNode)) {
            const { left, operator, right } = parentNode;
            const leftExpression = parentPath.get('left');
            if (operator === '&&' && t.isExpression(left)) {
                if (utils_1.hasComplexExpression(leftExpression)) {
                    utils_1.generateAnonymousState(this.renderScope, leftExpression, this.referencedIdentifiers, true);
                }
                const block = jsx_1.buildBlockElement();
                utils_1.newJSXIfAttr(block, leftExpression.node);
                block.children = [jsxElementPath.node];
                parentPath.replaceWith(block);
                if (statementParent) {
                    const name = utils_1.findIdentifierFromStatement(statementParent.node);
                    utils_1.setTemplate(name, jsxElementPath, this.templates);
                    // name && templates.set(name, path.node)
                }
            }
            if (operator === '||' && t.isExpression(left)) {
                const newNode = t.conditionalExpression(left, left, right);
                parentPath.replaceWith(newNode);
                // this.handleConditionExpr({ parentNode: newNode, parentPath, statementParent }, jsxElementPath)
            }
        }
        else if (t.isConditionalExpression(parentNode)) {
            const { consequent, alternate } = parentNode;
            const testExpression = parentPath.get('test');
            const block = jsx_1.buildBlockElement();
            if (utils_1.hasComplexExpression(testExpression)) {
                utils_1.generateAnonymousState(parentPath.scope, testExpression, this.referencedIdentifiers, true);
            }
            const test = testExpression.node;
            if (t.isJSXElement(consequent) && this.isLiteralOrUndefined(alternate)) {
                const { value, confident } = parentPath.get('alternate').evaluate();
                if (confident && !value || t.isIdentifier({ name: 'undefined' })) {
                    utils_1.newJSXIfAttr(block, test);
                    block.children = [jsxElementPath.node];
                    // newJSXIfAttr(jsxElementPath.node, test)
                    parentPath.replaceWith(block);
                }
                else {
                    const block2 = jsx_1.buildBlockElement();
                    block.children = [consequent];
                    utils_1.newJSXIfAttr(block, test);
                    jsx_1.setJSXAttr(block2, adapter_1.Adapter.else);
                    block2.children = [t.jSXExpressionContainer(alternate)];
                    const parentBlock = jsx_1.buildBlockElement();
                    parentBlock.children = [block, block2];
                    parentPath.replaceWith(parentBlock);
                }
                if (statementParent) {
                    const name = utils_1.findIdentifierFromStatement(statementParent.node);
                    utils_1.setTemplate(name, jsxElementPath, this.templates);
                    // name && templates.set(name, path.node)
                }
            }
            else if (this.isLiteralOrUndefined(consequent) && t.isJSXElement(alternate)) {
                const { value, confident } = parentPath.get('consequent').evaluate();
                if (confident && !value || t.isIdentifier({ name: 'undefined' })) {
                    utils_1.newJSXIfAttr(block, utils_1.reverseBoolean(test));
                    block.children = [jsxElementPath.node];
                    // newJSXIfAttr(jsxElementPath.node, test)
                    parentPath.replaceWith(block);
                }
                else {
                    const block2 = jsx_1.buildBlockElement();
                    block.children = [t.jSXExpressionContainer(consequent)];
                    utils_1.newJSXIfAttr(block, test);
                    jsx_1.setJSXAttr(block2, adapter_1.Adapter.else);
                    block2.children = [alternate];
                    const parentBlock = jsx_1.buildBlockElement();
                    parentBlock.children = [block, block2];
                    parentPath.replaceWith(parentBlock);
                }
                if (statementParent) {
                    const name = utils_1.findIdentifierFromStatement(statementParent.node);
                    utils_1.setTemplate(name, jsxElementPath, this.templates);
                    // name && templates.set(name, path.node)
                }
            }
            else if (t.isJSXElement(consequent) && t.isJSXElement(alternate)) {
                const block2 = jsx_1.buildBlockElement();
                block.children = [consequent];
                utils_1.newJSXIfAttr(block, test);
                jsx_1.setJSXAttr(block2, adapter_1.Adapter.else);
                block2.children = [alternate];
                const parentBlock = jsx_1.buildBlockElement();
                parentBlock.children = [block, block2];
                parentPath.replaceWith(parentBlock);
                if (statementParent) {
                    const name = utils_1.findIdentifierFromStatement(statementParent.node);
                    utils_1.setTemplate(name, jsxElementPath, this.templates);
                }
            }
            else if (t.isJSXElement(consequent) && t.isCallExpression(alternate) && !utils_1.isArrayMapCallExpression(parentPath.get('alternate'))) {
                const id = utils_1.generateAnonymousState(this.renderScope, parentPath.get('alternate'), this.referencedIdentifiers, true);
                parentPath.get('alternate').replaceWith(id);
                //
            }
            else if (t.isJSXElement(alternate) && t.isCallExpression(consequent) && !utils_1.isArrayMapCallExpression(parentPath.get('consequent'))) {
                const id = utils_1.generateAnonymousState(this.renderScope, parentPath.get('consequent'), this.referencedIdentifiers, true);
                parentPath.get('consequent').replaceWith(id);
            }
            else if (t.isJSXElement(alternate) && utils_1.isArrayMapCallExpression(parentPath.get('consequent'))) {
                //
            }
            else if (t.isJSXElement(consequent) && utils_1.isArrayMapCallExpression(parentPath.get('alternate'))) {
                //
            }
            else {
                block.children = [t.jSXExpressionContainer(consequent)];
                utils_1.newJSXIfAttr(block, test);
                const block2 = jsx_1.buildBlockElement();
                jsx_1.setJSXAttr(block2, adapter_1.Adapter.else);
                block2.children = [t.jSXExpressionContainer(alternate)];
                const parentBlock = jsx_1.buildBlockElement();
                parentBlock.children = [block, block2];
                parentPath.replaceWith(parentBlock);
                if (statementParent) {
                    const name = utils_1.findIdentifierFromStatement(statementParent.node);
                    utils_1.setTemplate(name, jsxElementPath, this.templates);
                }
            }
        }
    }
    setProperies() {
        if (!this.isDefaultRender) {
            return;
        }
        const properties = [];
        this.componentProperies.forEach((propName) => {
            const p = "quickapp" /* quickapp */ === "quickapp" /* quickapp */ && this.upperCaseComponentProps.has(propName) && !propName.startsWith('prv-fn') ? lodash_1.snakeCase(propName) : propName;
            properties.push(t.objectProperty(t.stringLiteral(p), t.objectExpression([
                t.objectProperty(t.stringLiteral('type'), t.nullLiteral()),
                t.objectProperty(t.stringLiteral('value'), t.nullLiteral())
            ])));
        });
        let classProp = t.classProperty(t.identifier('properties'), t.objectExpression(properties));
        classProp.static = true;
        const classPath = this.renderPath.findParent(isClassDcl);
        adapter_1.Adapter.type !== "alipay" /* alipay */ && classPath.node.body.body.unshift(classProp);
    }
    setLoopRefFlag() {
        if (this.loopRefs.size) {
            const classPath = this.renderPath.findParent(isClassDcl);
            classPath.node.body.body.unshift(t.classProperty(t.identifier('$$hasLoopRef'), t.booleanLiteral(true)));
        }
    }
    destructStateOrProps(key, path, properties, parentPath) {
        const hasStateOrProps = properties.filter(p => t.isObjectProperty(p) && t.isIdentifier(p.key) && key === p.key.name);
        if (hasStateOrProps.length === 0) {
            return;
        }
        if (hasStateOrProps.length !== properties.length) {
            throw utils_1.codeFrameError(path.node, 'state 或 props 只能单独从 this 中解构');
        }
        const declareState = template(`const ${key} = this.${key};`)();
        if (properties.length > 1) {
            const index = properties.findIndex(p => t.isObjectProperty(p) && t.isIdentifier(p.key, { name: key }));
            properties.splice(index, 1);
            parentPath.insertAfter(declareState);
        }
        else {
            parentPath.insertAfter(declareState);
            parentPath.remove();
        }
    }
    handleJSXInIfStatement(jsxElementPath, { parentNode, parentPath, isFinalReturn, isIfStemInLoop }) {
        if (t.isReturnStatement(parentNode)) {
            if (!isFinalReturn && !isIfStemInLoop) {
                return;
            }
            else {
                const ifStatement = parentPath.findParent(p => p.isIfStatement());
                const blockStatement = parentPath.findParent(p => p.isBlockStatement() && (p.parentPath === ifStatement));
                const loopCallExpr = jsxElementPath.findParent(p => utils_1.isArrayMapCallExpression(p));
                if (loopCallExpr && loopCallExpr.findParent(p => p.isIfStatement())) {
                    throw utils_1.codeFrameError(loopCallExpr.node, '在循环的上级和内部都有 if-else 的情况，需要把循环的内部 if-else return 的 JSX 设置为一个变量，保证单个 return 语句。\n 示例：https://gist.github.com/yuche/f6a0933df2537407abe0f426f774f670');
                }
                if (blockStatement && blockStatement.isBlockStatement()) {
                    blockStatement.traverse(this.renameIfScopeVaribale(blockStatement));
                }
                const blockAttrs = [];
                if ((adapter_1.isNewPropsSystem()) && !this.finalReturnElement && process.env.NODE_ENV !== 'test') {
                    if (this.isDefaultRender && adapter_1.Adapter.type !== "swan" /* swan */) {
                        blockAttrs.push(t.jSXAttribute(t.jSXIdentifier(adapter_1.Adapter.if), t.jSXExpressionContainer(t.jSXIdentifier(constant_1.IS_TARO_READY))));
                    }
                }
                const block = this.finalReturnElement || jsx_1.buildBlockElement(blockAttrs);
                if (utils_1.isBlockIfStatement(ifStatement, blockStatement)) {
                    let { test, alternate, consequent } = ifStatement.node;
                    if (utils_1.hasComplexExpression(ifStatement.get('test'))) {
                        ifStatement.node.test = test = utils_1.generateAnonymousState(blockStatement.scope, ifStatement.get('test'), this.referencedIdentifiers, true);
                    }
                    // blockStatement.node.body.push(t.returnStatement(
                    //   t.memberExpression(t.thisExpression(), t.identifier('state'))
                    // ))
                    if (alternate === blockStatement.node) {
                        throw utils_1.codeFrameError(parentNode.loc, '不必要的 else 分支，请遵从 ESLint consistent-return: https://eslint.org/docs/rules/consistent-return');
                    }
                    else if (consequent === blockStatement.node) {
                        const parentIfStatement = ifStatement.findParent(p => p.isIfStatement());
                        if (parentIfStatement) {
                            jsx_1.setJSXAttr(jsxElementPath.node, adapter_1.Adapter.elseif, t.jSXExpressionContainer(test), jsxElementPath);
                            if (loopCallExpr && this.loopIfStemComponentMap.has(loopCallExpr)) {
                                const block = this.loopIfStemComponentMap.get(loopCallExpr);
                                block.children.push(jsxElementPath.node);
                            }
                        }
                        else {
                            if (isIfStemInLoop && loopCallExpr && loopCallExpr.isCallExpression()) {
                                if (this.loopIfStemComponentMap.has(loopCallExpr)) {
                                    const component = this.loopIfStemComponentMap.get(loopCallExpr);
                                    utils_1.newJSXIfAttr(jsxElementPath.node, test, jsxElementPath);
                                    component.children.push(jsxElementPath.node);
                                }
                                else {
                                    utils_1.newJSXIfAttr(jsxElementPath.node, test, jsxElementPath);
                                    this.loopIfStemComponentMap.set(loopCallExpr, block);
                                    const arrowFunc = loopCallExpr.node.arguments[0];
                                    if (t.isArrowFunctionExpression(arrowFunc) && t.isBlockStatement(arrowFunc.body) && !arrowFunc.body.body.some(s => t.isReturnStatement(s))) {
                                        arrowFunc.body.body.push(t.returnStatement(jsx_1.buildBlockElement()));
                                        this.hasNoReturnLoopStem = true;
                                    }
                                }
                                let scope;
                                try {
                                    scope = loopCallExpr.get('arguments')[0].get('body').scope;
                                }
                                catch (error) {
                                    //
                                }
                                if (scope) {
                                    this.returnedifStemJSX.add(scope);
                                }
                            }
                            else {
                                if (this.topLevelIfStatement.size > 0) {
                                    jsx_1.setJSXAttr(jsxElementPath.node, adapter_1.Adapter.elseif, t.jSXExpressionContainer(test), jsxElementPath);
                                }
                                else {
                                    utils_1.newJSXIfAttr(jsxElementPath.node, test, jsxElementPath);
                                    this.topLevelIfStatement.add(ifStatement);
                                }
                            }
                        }
                    }
                }
                else if (block.children.length !== 0) {
                    if (this.topLevelIfStatement.size > 0) {
                        jsx_1.setJSXAttr(jsxElementPath.node, adapter_1.Adapter.else);
                    }
                }
                block.children.push(jsxElementPath.node);
                if (!this.loopIfStemComponentMap.has(loopCallExpr)) {
                    this.finalReturnElement = block;
                }
                this.returnedPaths.push(parentPath);
            }
        }
        else if (t.isArrowFunctionExpression(parentNode)) {
            // console.log('arrow')
        }
        else if (t.isAssignmentExpression(parentNode)) {
            const ifStatement = parentPath.findParent(p => p.isIfStatement());
            const blockStatement = parentPath.findParent(p => p.isBlockStatement() && (p.parentPath === ifStatement));
            if (blockStatement && blockStatement.isBlockStatement()) {
                blockStatement.traverse(this.renameIfScopeVaribale(blockStatement));
            }
            if (t.isIdentifier(parentNode.left)) {
                const assignmentName = parentNode.left.name;
                const renderScope = isIfStemInLoop ? jsxElementPath.findParent(p => utils_1.isArrayMapCallExpression(p)).get('arguments')[0].get('body').scope : this.renderScope;
                const bindingNode = renderScope.getOwnBinding(assignmentName).path.node;
                // tslint:disable-next-line
                const parallelIfStems = this.findParallelIfStem(ifStatement);
                const parentIfStatement = ifStatement.findParent(p => p.isIfStatement() && !parallelIfStems.has(p));
                // @TODO: 重构 this.templates 为基于作用域的 HashMap，现在仍然可能会存在重复的情况
                let block = this.templates.get(assignmentName) || jsx_1.buildBlockElement();
                let isElse = false;
                if (utils_1.isEmptyDeclarator(bindingNode)) {
                    const blockStatement = parentPath.findParent(p => p.isBlockStatement());
                    if (utils_1.isBlockIfStatement(ifStatement, blockStatement)) {
                        const { test, alternate, consequent } = ifStatement.node;
                        if (alternate === blockStatement.node) {
                            const newBlock = jsx_1.buildBlockElement();
                            jsx_1.setJSXAttr(newBlock, adapter_1.Adapter.else);
                            newBlock.children = [jsxElementPath.node];
                            jsxElementPath.node = newBlock;
                        }
                        else if (consequent === blockStatement.node) {
                            const parentIfStatement = ifStatement.findParent(p => p.isIfStatement());
                            const assignments = [];
                            let isAssignedBefore = false;
                            // @TODO: 重构这两种循环为通用模块
                            // 如果这个 JSX assigmnent 的作用域中有其他的 if block 曾经赋值过，它应该是 else-if
                            if (blockStatement && blockStatement.isBlockStatement()) {
                                for (const parentStatement of blockStatement.node.body) {
                                    if (t.isIfStatement(parentStatement) && t.isBlockStatement(parentStatement.consequent)) {
                                        const statements = parentStatement.consequent.body;
                                        for (const statement of statements) {
                                            if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression) && t.isIdentifier(statement.expression.left, { name: assignmentName })) {
                                                isAssignedBefore = true;
                                            }
                                        }
                                    }
                                }
                            }
                            // 如果这个 JSX assigmnent 的的父级作用域中的 prev sibling 有相同的赋值，它应该是 else-if
                            if (parentIfStatement) {
                                const { consequent } = parentIfStatement.node;
                                if (t.isBlockStatement(consequent)) {
                                    const body = consequent.body;
                                    for (const parentStatement of body) {
                                        if (t.isIfStatement(parentStatement) && t.isBlockStatement(parentStatement.consequent)) {
                                            const statements = parentStatement.consequent.body;
                                            for (const statement of statements) {
                                                if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression) && t.isIdentifier(statement.expression.left, { name: assignmentName })) {
                                                    assignments.push(statement.expression);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if ((parentIfStatement &&
                                (parentIfStatement.get('alternate') === ifStatement ||
                                    assignments.findIndex(a => a === parentNode) > 0))
                                ||
                                    isAssignedBefore) {
                                jsx_1.setJSXAttr(jsxElementPath.node, adapter_1.Adapter.elseif, t.jSXExpressionContainer(test), jsxElementPath);
                            }
                            else {
                                if (parentIfStatement) {
                                    if (this.isEmptyBlock(block)) {
                                        utils_1.newJSXIfAttr(block, parentIfStatement.node.test, jsxElementPath);
                                    }
                                    else if (parentIfStatement.node.alternate === ifStatement.parent) {
                                        const newBlock = jsx_1.buildBlockElement();
                                        jsx_1.setJSXAttr(newBlock, adapter_1.Adapter.else);
                                        this.insertElseBlock(block, newBlock, parentIfStatement.node.test);
                                        isElse = true;
                                    }
                                    else {
                                        const newBlock = jsx_1.buildBlockElement();
                                        jsx_1.setJSXAttr(newBlock, adapter_1.Adapter.elseif, t.jSXExpressionContainer(parentIfStatement.node.test), jsxElementPath);
                                        block.children.push(newBlock);
                                    }
                                }
                                utils_1.newJSXIfAttr(jsxElementPath.node, test, jsxElementPath);
                            }
                        }
                        const ifAttr = block.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.if);
                        if (ifAttr && t.isJSXExpressionContainer(ifAttr.value, { expression: test })) {
                            const newBlock = jsx_1.buildBlockElement();
                            newBlock.children = [block, jsxElementPath.node];
                            block = newBlock;
                        }
                        else if (parentIfStatement && ifStatement.parentPath !== parentIfStatement) {
                            let hasNest = false;
                            this.handleNestedIfStatement(block, jsxElementPath.node, parentIfStatement.node.test, hasNest, isElse || !!ifStatement.findParent(p => p.node === parentIfStatement.node.alternate));
                            if (!hasNest && parentIfStatement.get('alternate') !== ifStatement) {
                                const ifAttr = block.openingElement.attributes.find(a => t.isJSXIdentifier(a.name) && a.name.name === adapter_1.Adapter.if);
                                if (ifAttr && t.isJSXExpressionContainer(ifAttr.value, { expression: parentIfStatement.node.test })) {
                                    const newBlock = jsx_1.buildBlockElement();
                                    block.children.push(jsxElementPath.node);
                                    newBlock.children = [block];
                                    block = newBlock;
                                }
                            }
                        }
                        else {
                            block.children.push(jsxElementPath.node);
                        }
                        // setTemplate(name, path, templates)
                        assignmentName && this.templates.set(assignmentName, block);
                        if (isIfStemInLoop) {
                            this.replaceIdWithTemplate()(renderScope.path);
                            this.returnedPaths.push(parentPath);
                        }
                    }
                }
                else {
                    throw utils_1.codeFrameError(jsxElementPath.node.loc, '请将 JSX 赋值表达式初始化为 null，然后再进行 if 条件表达式赋值。');
                }
            }
        }
        else if (!t.isJSXElement(parentNode)) {
            // throwError(path, '考虑只对 JSX 元素赋值一次。')
        }
    }
    genPropsSettingExpression(properties, id, previd) {
        return t.callExpression(t.memberExpression(t.identifier(constant_1.PROPS_MANAGER), t.identifier('set')), [Array.isArray(properties) ? t.objectExpression(properties) : properties, id, previd]);
    }
    getPropsFromAttrs(openingElement) {
        const attrs = openingElement.attributes;
        const properties = [];
        openingElement.attributes = attrs.filter(attr => {
            if (t.isJSXSpreadAttribute(attr)) {
                properties.push(t.spreadProperty(attr.argument));
                return false;
            }
            else if (t.isJSXAttribute(attr)) {
                const { name, value } = attr;
                if (t.isJSXIdentifier(name)
                    && name.name !== 'key'
                    && name.name !== 'id'
                    && !(name.name === 'extraProps' && adapter_1.Adapter.type === "weapp" /* weapp */)
                    && name.name !== adapter_1.Adapter.for
                    && name.name !== adapter_1.Adapter.forItem
                    && name.name !== adapter_1.Adapter.forIndex
                    && name.name.indexOf('render') !== 0
                    && !t.isJSXElement(value)
                    && !name.name.includes('-')) {
                    // tslint:disable-next-line: strict-type-predicates
                    const v = value === null
                        ? t.booleanLiteral(true)
                        : (t.isJSXExpressionContainer(value)
                            ? value.expression
                            : value);
                    v && properties.push(t.objectProperty(t.stringLiteral(name.name), v));
                    return false;
                }
                return true;
            }
        });
        return properties;
    }
    addIdToElement(jsxElementPath) {
        const openingElement = jsxElementPath.node.openingElement;
        if (openingElement.attributes.find(attr => {
            return t.isJSXAttribute(attr) && attr.name.name === 'compid';
        })) {
            return;
        }
        if (this.isInternalComponent(openingElement)) {
            if (this.isEmptyProps(openingElement.attributes) && adapter_1.Adapter.type !== "swan" /* swan */) {
                return;
            }
            const compId = utils_1.genCompid();
            const prevName = `${constant_1.PREV_COMPID}__${compId}`;
            const name = `${constant_1.COMPID}__${compId}`;
            const variableName = t.identifier(name);
            this.referencedIdentifiers.add(variableName);
            const idExpr = t.variableDeclaration('const', [
                t.variableDeclarator(t.arrayPattern([t.identifier(prevName), variableName]), t.callExpression(t.identifier(constant_1.GEN_COMP_ID), [
                    t.binaryExpression('+', this.prefixExpr(), t.stringLiteral(name))
                ]))
            ]);
            // createData 中设置 props
            const properties = this.getPropsFromAttrs(openingElement);
            const propsId = `$props__${compId}`;
            const collectedProps = utils_1.buildConstVariableDeclaration(propsId, t.objectExpression(properties));
            const result = jsxElementPath.getStatementParent().insertBefore(collectedProps);
            this.propsDecls.set(propsId, result[0]);
            const propsSettingExpr = this.genPropsSettingExpression(t.identifier(propsId), variableName, t.identifier(prevName));
            this.genCompidExprs.add(idExpr);
            const expr = utils_1.setAncestorCondition(jsxElementPath, propsSettingExpr);
            this.ancestorConditions.add(expr);
            const ifStatement = jsxElementPath.findParent(p => p.isIfStatement());
            const blockStatement = jsxElementPath.findParent(p => p.isBlockStatement());
            let blockStem = this.renderPath.node.body;
            if (ifStatement && blockStatement) {
                const consequent = ifStatement.get('consequent');
                const alternate = ifStatement.get('alternate');
                if (blockStatement === consequent || blockStatement === alternate) {
                    blockStem = blockStatement.node;
                }
            }
            const funcs = this.propsSettingExpressions.get(blockStem);
            const func = () => t.expressionStatement(expr);
            this.propsSettingExpressions.set(blockStem, funcs ? [...funcs, func] : [func]);
            // xml 中打上组件 ID
            jsx_1.setJSXAttr(jsxElementPath.node, 'compid', t.jSXExpressionContainer(variableName));
        }
    }
    handleComponents(renderBody) {
        renderBody.traverse({
            JSXElement: jsxElementPath => this.addIdToElement(jsxElementPath)
        });
    }
    handleQuickappProps() {
        if (adapter_1.Adapter.type !== "quickapp" /* quickapp */) {
            return;
        }
        this.renderPath.traverse({
            Identifier: (path) => {
                if (!this.upperCaseComponentProps.has(path.node.name)) {
                    return;
                }
                if (utils_1.isDerivedFromProps(this.renderScope, path.node.name)) {
                    this.renderScope.rename(path.node.name, lodash_1.snakeCase(path.node.name));
                    path.replaceWith(t.identifier(lodash_1.snakeCase(path.node.name)));
                }
                const sibling = path.getSibling('object');
                if (sibling && sibling.isMemberExpression() && sibling.get('object').isThisExpression() && sibling.get('property').isIdentifier({ name: 'props' })) {
                    path.replaceWith(t.identifier(lodash_1.snakeCase(path.node.name)));
                }
            }
        });
    }
    handleClosureComp() {
        this.deferedHandleClosureJSXFunc.forEach(func => func());
    }
    checkDuplicateData() {
        this.initState.forEach((stateName) => {
            if (this.templates.has(stateName)) {
                throw utils_1.codeFrameError(this.templates.get(stateName), `自定义变量组件名: \`${stateName}\` 和已有 this.state.${stateName} 重复。请使用另一个变量名。`);
            }
        });
        this.componentProperies.forEach((componentName) => {
            if (this.componentProperies.has(componentName)) {
                throw utils_1.codeFrameError(this.renderPath.node, `state: \`${componentName}\` 和已有 this.props.${componentName} 重复。请使用另一个变量名。`);
            }
            if (this.templates.has(componentName)) {
                throw utils_1.codeFrameError(this.templates.get(componentName), `自定义变量组件名: \`${componentName}\` 和已有 this.props.${componentName} 重复。请使用另一个变量名。`);
            }
        });
    }
    addRefIdentifier(path, id) {
        const arrayMap = path.findParent(p => utils_1.isArrayMapCallExpression(p));
        if (arrayMap && arrayMap.isCallExpression()) {
            this.loopRefIdentifiers.set(id.name, arrayMap);
        }
        else {
            id && this.referencedIdentifiers.add(id);
        }
    }
    findParentIndices(callee, indexId) {
        const loopIndices = [];
        const loops = t.arrayExpression([]);
        utils_1.findParentLoops(callee, this.loopComponentNames, loops);
        for (const el of loops.elements) {
            if (t.isObjectExpression(el)) {
                for (const prop of el.properties) {
                    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'indexId' }) && t.isIdentifier(prop.value)) {
                        loopIndices.push(prop.value.name);
                    }
                }
            }
        }
        if (loopIndices.length === 0) {
            if (t.isIdentifier(indexId)) {
                loopIndices.push(indexId.name);
            }
            else {
                throw utils_1.codeFrameError(callee.node, '循环中使用自定义组件需要暴露循环的 index');
            }
        }
        return loopIndices;
    }
    setOutputTemplate() {
        if (adapter_1.Adapter.type === "quickapp" /* quickapp */ && options_1.transformOptions.rootProps && options_1.transformOptions.isRoot) {
            const attrs = [];
            for (const key in options_1.transformOptions.rootProps) {
                if (options_1.transformOptions.rootProps.hasOwnProperty(key)) {
                    const value = options_1.transformOptions.rootProps[key];
                    const keyName = key + '__temp';
                    const decl = utils_1.buildConstVariableDeclaration(keyName, t.identifier(JSON.stringify(value)));
                    this.referencedIdentifiers.add(t.identifier(keyName));
                    this.renderPath.node.body.body.push(decl);
                    attrs.push(t.jSXAttribute(t.jSXIdentifier(key), t.jSXExpressionContainer(t.identifier(keyName))));
                }
            }
            this.finalReturnElement.openingElement.attributes.push(...attrs);
        }
        if (!this.finalReturnElement) {
            throw utils_1.codeFrameError(this.renderPath.node, '没有找到返回的 JSX 元素，你是不是忘记 return 了？');
        }
        this.outputTemplate = jsx_1.parseJSXElement(this.finalReturnElement, true);
        if (!this.isDefaultRender) {
            this.outputTemplate = `<template name="${this.renderMethodName}">${this.outputTemplate}</template>`;
        }
    }
    removeJSXStatement() {
        this.jsxDeclarations.forEach(d => d && !d.removed && utils_1.isContainJSXElement(d) && d.remove());
        this.returnedPaths.forEach((p) => {
            if (p.removed) {
                return;
            }
            const ifStem = p.findParent(_ => _.isIfStatement());
            if (ifStem) {
                const node = p.node;
                if (!node) {
                    return;
                }
                if (t.isJSXElement(node.argument)) {
                    const jsx = node.argument;
                    if (jsx.children.length === 0 && jsx.openingElement.attributes.length === 0 && !this.isIfStemInLoop(p.get('argument'))) {
                        node.argument = t.nullLiteral();
                    }
                    else {
                        p.remove();
                    }
                }
                else {
                    const isValid = p.get('argument').evaluateTruthy();
                    if (isValid === false) {
                        node.argument = t.nullLiteral();
                    }
                    else {
                        p.remove();
                    }
                }
            }
            else {
                p.remove();
            }
        });
    }
    setCustomEvent() {
        const classPath = this.renderPath.findParent(isClassDcl);
        const eventPropName = adapter_1.Adapter.type === "quickapp" /* quickapp */ ? 'privateTaroEvent' : '$$events';
        const body = classPath.node.body.body.find(b => t.isClassProperty(b) && b.key.name === eventPropName);
        const usedEvents = Array.from(this.usedEvents).map(s => t.stringLiteral(s));
        if (body && t.isArrayExpression(body.value)) {
            body.value = t.arrayExpression(lodash_1.uniq(body.value.elements.concat(usedEvents)));
        }
        else {
            let classProp = t.classProperty(t.identifier(eventPropName), t.arrayExpression(usedEvents)); // babel 6 typing 没有 static
            classProp.static = true;
            classPath.node.body.body.unshift(classProp);
        }
    }
    setUsedState() {
        if (!this.isDefaultRender) {
            return;
        }
        for (const [key, method] of this.methods) {
            if (method) {
                if (method.isClassMethod()) {
                    const kind = method.node.kind;
                    if (kind === 'get') {
                        this.classComputedState.add(key);
                    }
                }
            }
        }
        let componentProperies = lodash_1.cloneDeep(this.componentProperies);
        componentProperies.forEach(s => {
            if (s.startsWith(constant_1.FN_PREFIX)) {
                const eventName = s.slice(5);
                if (componentProperies.has(eventName)) {
                    componentProperies.delete(s);
                    componentProperies.delete(eventName);
                }
            }
        });
        if (adapter_1.Adapter.type === "quickapp" /* quickapp */) {
            componentProperies = new Set(Array.from(componentProperies).map(p => this.upperCaseComponentProps.has(p) && !p.startsWith('on') && !p.startsWith('prv-fn') ? lodash_1.snakeCase(p) : p));
        }
        Array.from(this.reserveStateWords).forEach(this.setReserveWord);
        let usedState = Array.from(new Set(Array.from(this.referencedIdentifiers)
            .map(i => i.name)
            .concat([...this.initState, ...this.usedThisState, ...componentProperies, ...this.classComputedState])))
            .concat(...this.usedState)
            // .filter(i => {
            //   return !methods.has(i)
            // })
            .filter(i => !this.loopScopes.has(i))
            .filter(i => !this.templates.has(i))
            .filter(Boolean);
        if (adapter_1.Adapter.type === "quickapp" /* quickapp */) {
            usedState = usedState
                .filter(i => !new Set([...this.upperCaseComponentProps].map(i => i.toLowerCase())).has(i))
                .filter(i => !this.upperCaseComponentProps.has(i));
        }
        const classPath = this.renderPath.findParent(isClassDcl);
        classPath.node.body.body.unshift(t.classProperty(t.identifier('$usedState'), t.arrayExpression([...new Set(usedState
                .filter(s => !this.loopScopes.has(s.split('.')[0]))
                .filter(i => i !== constant_1.MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
                .filter(i => utils_1.isVarName(i))
                .filter(i => !this.loopRefIdentifiers.has(i))
                .concat(Array.from(this.customComponentNames)))]
            .map(s => t.stringLiteral(s)))));
    }
    checkDuplicateName() {
        this.loopScopes.forEach(s => {
            if (s.includes('anonIdx')) {
                return;
            }
            if (this.renderPath.scope.hasBinding(s)) {
                const err = utils_1.codeFrameError(this.renderPath.scope.getBinding(s).path.node, '此变量声明与循环变量冲突，可能会造成问题。');
                // tslint:disable-next-line: no-console
                console.warn('Warning: ', err.message);
                this.loopScopes.delete(s);
            }
        });
    }
    setPendingState() {
        let propertyKeys = Array.from(new Set(Array.from(this.referencedIdentifiers)
            .map(i => i.name)))
            .filter(i => {
            const method = this.methods.get(i);
            let isGet = false;
            if (method) {
                if (method.isClassMethod()) {
                    const kind = method.node.kind;
                    if (kind === 'get') {
                        isGet = true;
                    }
                }
            }
            return !this.methods.has(i) || isGet;
        })
            .filter(i => !this.loopScopes.has(i))
            .filter(i => !this.templates.has(i))
            .filter(i => utils_1.isVarName(i))
            .filter(i => i !== constant_1.MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
            .filter(i => !i.startsWith('$$'))
            .filter(i => !i.startsWith('_$indexKey'))
            .filter(i => !this.loopRefIdentifiers.has(i));
        if (this.isDefaultRender) {
            propertyKeys = propertyKeys.filter(i => !this.initState.has(i));
        }
        let properties = propertyKeys.map(i => t.objectProperty(t.identifier(i), t.identifier(i)));
        const pendingState = t.objectExpression(properties.concat(Array.from(this.classComputedState).filter(i => {
            return !propertyKeys.includes(i);
        }).map(i => {
            return t.objectProperty(t.identifier(i), t.memberExpression(t.thisExpression(), t.identifier(i)));
        })));
        this.propsSettingExpressions.forEach((exprs, stem) => {
            stem.body.push(...exprs.map(e => e()));
        });
        this.renderPath.node.body.body.unshift(...Array.from(this.genCompidExprs));
        if (this.isDefaultRender) {
            if (this.refObjExpr && this.refObjExpr.length) {
                this.renderPath.node.body.body.push(t.expressionStatement(t.callExpression(t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier('$$refs')), t.identifier('pushRefs')), [t.arrayExpression(this.refObjExpr)])));
            }
            this.renderPath.node.body.body = this.renderPath.node.body.body.concat(
            // ...propsStatement,
            buildAssignState(pendingState), t.returnStatement(t.memberExpression(t.thisExpression(), t.identifier('state'))));
        }
        else {
            const usedState = Array.from(this.usedThisState).map(s => t.objectProperty(t.identifier(s), t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier('state')), t.identifier(s))));
            this.renderPath.node.body.body.push(
            // ...propsStatement,
            t.returnStatement(t.objectExpression(pendingState.properties.concat(usedState))));
            const { async, body, params } = this.renderPath.node;
            this.renderPath.replaceWith(t.classMethod('method', t.identifier(`_create${this.renderMethodName.slice(6)}Data`), [t.identifier(constant_1.CLASS_COMPONENT_UID)], t.blockStatement([
                t.returnStatement(t.arrowFunctionExpression(params, body, async))
            ])));
        }
        this.renderPath.traverse({
            Identifier: (path) => {
                if (this.propsDecls.has(path.node.name) && path.parentPath.isCallExpression()) {
                    const { callee } = path.parentPath.node;
                    if (t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: constant_1.PROPS_MANAGER }) && t.isIdentifier(callee.property, { name: 'set' })) {
                        const decl = this.propsDecls.get(path.node.name);
                        path.replaceWith(decl.node.declarations[0].init);
                        this.propsDecls.delete(path.node.name);
                        !decl.removed && decl.remove();
                    }
                }
            }
        });
    }
    createData() {
        if (!this.isDefaultRender) {
            return;
        }
        const renderBody = this.renderPath.get('body');
        renderBody.traverse({
            ThisExpression(path) {
                const property = path.getSibling('property');
                if (property.isIdentifier({ name: 'state' })) {
                    property.replaceWith(t.identifier('__state'));
                }
                if (property.isIdentifier({ name: 'props' })) {
                    property.replaceWith(t.identifier('__props'));
                }
            }
        });
        this.usedThisProperties.forEach(prop => {
            if (this.renderScope.hasBinding(prop)) {
                const binding = this.renderScope.getBinding(prop);
                throw utils_1.codeFrameError(binding.path.node, `此变量声明与 this.${prop} 的声明冲突，请更改其中一个变量名。详情见：https://github.com/NervJS/taro/issues/822`);
            }
        });
        this.renderPath.node.body.body.unshift(template(`this.__state = arguments[0] || this.state || {};`)(), template(`this.__props = arguments[1] || this.props || {};`)(), template(`const __isRunloopRef = arguments[2];`)(), template(`const __prefix = this.$prefix`)(), this.usedThisProperties.size
            ? t.variableDeclaration('const', [
                t.variableDeclarator(t.objectPattern(Array.from(this.usedThisProperties).map(p => t.objectProperty(t.identifier(p), t.identifier(p)))), t.thisExpression())
            ])
            : t.emptyStatement());
        if (t.isIdentifier(this.renderPath.node.key)) {
            this.renderPath.node.key.name = '_createData';
        }
    }
}
exports.RenderParser = RenderParser;
//# sourceMappingURL=render.js.map