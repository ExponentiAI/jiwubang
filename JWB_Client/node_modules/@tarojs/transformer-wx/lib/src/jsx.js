"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel_generator_1 = require("babel-generator");
const t = require("babel-types");
const lodash_1 = require("lodash");
const constant_1 = require("./constant");
const create_html_element_1 = require("./create-html-element");
const utils_1 = require("./utils");
const adapter_1 = require("./adapter");
const functional_1 = require("./functional");
const options_1 = require("./options");
function isStartWithWX(str) {
    return str[0] === 'w' && str[1] === 'x';
}
exports.isStartWithWX = isStartWithWX;
const specialComponentName = ['block', 'Block', 'slot', 'Slot'];
function removeJSXThisProperty(path) {
    if (!path.parentPath.isCallExpression()) {
        const p = path.getSibling('property');
        if (p.isIdentifier({ name: 'props' }) ||
            p.isIdentifier({ name: 'state' })) {
            path.parentPath.replaceWithSourceString('this');
        }
        else {
            path.parentPath.replaceWith(p);
        }
    }
}
exports.removeJSXThisProperty = removeJSXThisProperty;
function findJSXAttrByName(attrs, name) {
    for (const attr of attrs) {
        if (!t.isJSXAttribute(attr))
            continue;
        if (!t.isJSXIdentifier(attr.name)) {
            break;
        }
        if (attr.name.name === name) {
            return attr;
        }
    }
    return null;
}
exports.findJSXAttrByName = findJSXAttrByName;
function buildRefTemplate(name, refName, loop, key) {
    const isSwan = adapter_1.Adapter.type === "swan" /* swan */;
    const dataString = isSwan ? `{{{...${refName ? `${loop ? '' : '$$'}${refName}` : '__data'}}}}` : `{{...${refName ? `${loop ? '' : '$$'}${refName}` : '__data'}}}`;
    const attrs = [
        t.jSXAttribute(t.jSXIdentifier('is'), t.stringLiteral(name)),
        t.jSXAttribute(t.jSXIdentifier('data'), t.stringLiteral(dataString))
    ];
    if (key) {
        attrs.push(key);
    }
    return t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('template'), attrs), t.jSXClosingElement(t.jSXIdentifier('template')), []);
}
exports.buildRefTemplate = buildRefTemplate;
function buildJSXAttr(name, value) {
    return t.jSXAttribute(t.jSXIdentifier(name), t.jSXExpressionContainer(value));
}
exports.buildJSXAttr = buildJSXAttr;
function newJSXIfAttr(jsx, value) {
    jsx.openingElement.attributes.push(buildJSXAttr(adapter_1.Adapter.if, value));
}
exports.newJSXIfAttr = newJSXIfAttr;
function setJSXAttr(jsx, name, value, path) {
    if ((name === adapter_1.Adapter.forIndex || name === adapter_1.Adapter.forItem) && adapter_1.Adapter.type === "quickapp" /* quickapp */) {
        return;
    }
    const element = jsx.openingElement;
    // tslint:disable-next-line: strict-type-predicates
    if (element == null || !t.isJSXIdentifier(element.name)) {
        return;
    }
    if (element.name.name === 'Block' || element.name.name === 'block' || !path) {
        jsx.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier(name), value));
    }
    else {
        const block = buildBlockElement();
        setJSXAttr(block, name, value);
        block.children = [jsx];
        path.node = block;
    }
}
exports.setJSXAttr = setJSXAttr;
function buildTrueJSXAttrValue() {
    return t.jSXExpressionContainer(t.booleanLiteral(true));
}
exports.buildTrueJSXAttrValue = buildTrueJSXAttrValue;
function generateJSXAttr(ast) {
    const code = utils_1.decodeUnicode(babel_generator_1.default(ast, {
        quotes: 'single',
        jsonCompatibleStrings: true
    }).code)
        .replace(/</g, constant_1.lessThanSignPlacehold);
    if (functional_1.Status.isSFC) {
        return code;
    }
    return code.replace(/(this\.props\.)|(this\.state\.)/g, '')
        .replace(/(props\.)|(state\.)/g, '')
        .replace(/this\./g, '');
}
exports.generateJSXAttr = generateJSXAttr;
function isAllLiteral(...args) {
    return args.every(p => t.isLiteral(p));
}
exports.isAllLiteral = isAllLiteral;
function buildBlockElement(attrs = [], isView = false) {
    let blockName = adapter_1.Adapter.type === "quickapp" /* quickapp */ ? 'div' : 'block';
    if (isView) {
        blockName = 'View';
    }
    return t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier(blockName), attrs), t.jSXClosingElement(t.jSXIdentifier(blockName)), []);
}
exports.buildBlockElement = buildBlockElement;
function parseJSXChildren(children) {
    return children
        .reduce((str, child) => {
        if (t.isJSXText(child)) {
            const strings = [];
            child.value.split(/(\r?\n\s*)/).forEach((val) => {
                const value = val
                    .replace(/\u00a0/g, '&nbsp;')
                    .replace(/\u2002/g, '&ensp;')
                    .replace(/\u2003/g, '&emsp;');
                if (!value) {
                    return;
                }
                if (value.startsWith('\n')) {
                    return;
                }
                strings.push(value);
            });
            return str + strings.join('');
        }
        if (t.isJSXElement(child)) {
            return str + parseJSXElement(child);
        }
        if (t.isJSXExpressionContainer(child)) {
            if (t.isJSXElement(child.expression)) {
                return str + parseJSXElement(child.expression);
            }
            return str + `{${generateJSXAttr(child)}}`;
        }
        return str;
    }, '');
}
function parseJSXElement(element, isFirstEmit = false) {
    const children = element.children;
    const { attributes, name } = element.openingElement;
    const TRIGGER_OBSERER = adapter_1.Adapter.type === "swan" /* swan */ || adapter_1.Adapter.type === "quickapp" /* quickapp */ ? 'privateTriggerObserer' : '__triggerObserer';
    const TRIGGER_OBSERER_KEY = adapter_1.Adapter.type === "quickapp" /* quickapp */ ? 'privateTriggerObsererKey' : '_triggerObserer';
    if (t.isJSXMemberExpression(name)) {
        throw utils_1.codeFrameError(name.loc, '暂不支持 JSX 成员表达式');
    }
    const componentName = name.name;
    const isDefaultComponent = constant_1.DEFAULT_Component_SET.has(componentName);
    const componentSpecialProps = constant_1.SPECIAL_COMPONENT_PROPS.get(componentName);
    const componentTransfromProps = constant_1.TRANSFORM_COMPONENT_PROPS.get(adapter_1.Adapter.type);
    let hasElseAttr = false;
    const isJSXMetHod = componentName === 'Template' && attributes.some(a => a.name.name === 'is' && t.isStringLiteral(a.value) && a.value.value.startsWith('render'));
    attributes.forEach((a, index) => {
        if (t.isJSXAttribute(a) && a.name.name === adapter_1.Adapter.else && !['block', 'Block'].includes(componentName) && !isDefaultComponent) {
            hasElseAttr = true;
            attributes.splice(index, 1);
        }
    });
    if (hasElseAttr) {
        return create_html_element_1.createHTMLElement({
            name: 'block',
            attributes: {
                [adapter_1.Adapter.else]: true
            },
            value: parseJSXChildren([element])
        });
    }
    let attributesTrans = {};
    if (attributes.length) {
        attributesTrans = attributes.reduce((obj, attr) => {
            if (t.isJSXSpreadAttribute(attr)) {
                if (adapter_1.isNewPropsSystem())
                    return {};
                throw utils_1.codeFrameError(attr.loc, 'JSX 参数暂不支持 ...spread 表达式');
            }
            let name = attr.name.name;
            if (constant_1.DEFAULT_Component_SET.has(componentName)) {
                if (name === 'className') {
                    name = 'class';
                }
                if (typeof name === 'string' && /(^on[A-Z_])|(^catch[A-Z_])/.test(name) && adapter_1.Adapter.type === "quickapp" /* quickapp */) {
                    name = name.toLowerCase();
                }
            }
            if ("quickapp" /* quickapp */ === adapter_1.Adapter.type && !constant_1.DEFAULT_Component_SET_COPY.has(componentName) && typeof name === 'string' && !/(^on[A-Z_])|(^catch[A-Z_])/.test(name)) {
                name = lodash_1.snakeCase(name);
            }
            let value = true;
            let attrValue = attr.value;
            if (typeof name === 'string') {
                const isAlipayOrQuickappEvent = (adapter_1.Adapter.type === "alipay" /* alipay */ || adapter_1.Adapter.type === "quickapp" /* quickapp */) && /(^on[A-Z_])|(^catch[A-Z_])/.test(name);
                if (t.isStringLiteral(attrValue)) {
                    value = attrValue.value;
                }
                else if (t.isJSXExpressionContainer(attrValue)) {
                    let isBindEvent = (name.startsWith('bind') && name !== 'bind') || (name.startsWith('catch') && name !== 'catch');
                    let code = utils_1.decodeUnicode(babel_generator_1.default(attrValue.expression, {
                        quotes: 'single',
                        concise: true
                    }).code)
                        .replace(/"/g, "'")
                        .replace(/(this\.props\.)|(this\.state\.)/g, '')
                        .replace(/this\./g, '');
                    if ("swan" /* swan */ === adapter_1.Adapter.type &&
                        code !== 'true' &&
                        code !== 'false' &&
                        constant_1.swanSpecialAttrs[componentName] &&
                        constant_1.swanSpecialAttrs[componentName].includes(name)) {
                        value = `{= ${code} =}`;
                    }
                    else {
                        if (adapter_1.Adapter.key === name) {
                            const splitCode = code.split('.');
                            if (splitCode.length > 1) {
                                value = splitCode.slice(1).join('.');
                            }
                            else {
                                value = code;
                            }
                        }
                        else {
                            const isTemplateData = isJSXMetHod && name === 'data';
                            value = isBindEvent || isAlipayOrQuickappEvent ? code : `{{${isJSXMetHod && name === 'data' ? '...' : ''}${code}}}`;
                            if (isTemplateData && "swan" /* swan */ === adapter_1.Adapter.type) {
                                value = `{${value}}`;
                            }
                        }
                    }
                    if (adapter_1.Adapter.type === "swan" /* swan */ && name === adapter_1.Adapter.for) {
                        value = code;
                    }
                    if (t.isStringLiteral(attrValue.expression)) {
                        value = attrValue.expression.value;
                    }
                    // tslint:disable-next-line: strict-type-predicates
                }
                else if (attrValue === null && name !== adapter_1.Adapter.else) {
                    value = `{{true}}`;
                }
                if (constant_1.THIRD_PARTY_COMPONENTS.has(componentName) && /^bind/.test(name) && name.includes('-')) {
                    name = name.replace(/^bind/, 'bind:');
                }
                if (componentTransfromProps && componentTransfromProps[componentName]) {
                    const transfromProps = componentTransfromProps[componentName];
                    Object.keys(transfromProps).forEach(oriName => {
                        if (name === oriName) {
                            name = transfromProps[oriName];
                        }
                    });
                }
                if ((componentName === 'Input' || componentName === 'input') && name === 'maxLength') {
                    obj['maxlength'] = value;
                }
                else if ((componentSpecialProps && componentSpecialProps.has(name)) ||
                    name.startsWith(constant_1.FN_PREFIX) ||
                    isAlipayOrQuickappEvent) {
                    obj[name] = value;
                }
                else {
                    obj[isDefaultComponent && !name.includes('-') && !name.includes(':') ? lodash_1.kebabCase(name) : name] = value;
                }
            }
            if (!isDefaultComponent && !specialComponentName.includes(componentName) && !adapter_1.isNewPropsSystem()) {
                obj[TRIGGER_OBSERER] = `{{ ${TRIGGER_OBSERER_KEY} }}`;
            }
            return obj;
        }, {});
    }
    else if (!isDefaultComponent && !specialComponentName.includes(componentName)) {
        if (!adapter_1.isNewPropsSystem()) {
            attributesTrans[TRIGGER_OBSERER] = `{{ ${TRIGGER_OBSERER_KEY} }}`;
        }
    }
    let elementStr;
    if (isFirstEmit && "quickapp" /* quickapp */ === adapter_1.Adapter.type && !options_1.transformOptions.isRoot) {
        const rootAttributes = Object.assign({}, attributesTrans);
        delete rootAttributes[adapter_1.Adapter.if];
        elementStr = create_html_element_1.createHTMLElement({
            name: lodash_1.kebabCase(componentName),
            attributes: rootAttributes,
            value: create_html_element_1.createHTMLElement({
                name: 'block',
                attributes: { [adapter_1.Adapter.if]: attributesTrans[adapter_1.Adapter.if] },
                value: parseJSXChildren(children)
            })
        }, isFirstEmit);
    }
    else {
        elementStr = create_html_element_1.createHTMLElement({
            name: lodash_1.kebabCase(componentName),
            attributes: attributesTrans,
            value: parseJSXChildren(children)
        }, isFirstEmit);
    }
    return elementStr;
}
exports.parseJSXElement = parseJSXElement;
function generateHTMLTemplate(template, name) {
    return create_html_element_1.createHTMLElement({
        name: 'template',
        attributes: {
            name
        },
        value: parseJSXElement(template)
    });
}
exports.generateHTMLTemplate = generateHTMLTemplate;
//# sourceMappingURL=jsx.js.map