"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_1 = require("./adapter");
const constant_1 = require("./constant");
const options_1 = require("./options");
const lodash_1 = require("lodash");
const env_1 = require("./env");
const voidHtmlTags = new Set([
    // 'image',
    'img',
    'input',
    'import'
]);
if (env_1.isTestEnv) {
    voidHtmlTags.add('image');
}
exports.capitalized = (name) => name.charAt(0).toUpperCase() + name.slice(1);
function stringifyAttributes(input, componentName) {
    const attributes = [];
    for (const key of Object.keys(input)) {
        let value = input[key];
        if (value === false) {
            continue;
        }
        if (Array.isArray(value)) {
            value = value.join(' ');
        }
        let attribute = key;
        if ("quickapp" /* quickapp */ === adapter_1.Adapter.type && key === 'style') {
            const nameCapitalized = exports.capitalized(componentName);
            if (!['div', 'text'].includes(componentName) &&
                (constant_1.quickappComponentName.has(nameCapitalized) || constant_1.DEFAULT_Component_SET_COPY.has(nameCapitalized))) {
                attribute = 'customstyle';
            }
        }
        if (process.env.NODE_ENV !== 'test' &&
            ("weapp" /* weapp */ === adapter_1.Adapter.type || "qq" /* qq */ === adapter_1.Adapter.type) &&
            key === adapter_1.Adapter.key &&
            typeof value === 'string') {
            value = value.split(`${constant_1.LOOP_ORIGINAL}.`).join('');
        }
        if (value !== true) {
            attribute += `="${String(value)}"`;
        }
        attributes.push(attribute);
    }
    return attributes.length > 0 ? ' ' + attributes.join(' ') : '';
}
exports.createHTMLElement = (options, isFirstEmit = false) => {
    options = Object.assign({
        name: 'div',
        attributes: {},
        value: ''
    }, options);
    const name = options.name;
    if ("quickapp" /* quickapp */ === adapter_1.Adapter.type) {
        const nameCapitalized = exports.capitalized(name);
        if (constant_1.quickappComponentName.has(nameCapitalized)) {
            options.name = `taro-${name}`;
            if (options.attributes['className']) {
                options.attributes['class'] = options.attributes['className'];
                delete options.attributes['className'];
            }
        }
        if (isFirstEmit && name === 'div' && options_1.transformOptions.isRoot) {
            options.name = 'taro-page';
            for (const key in options.attributes) {
                if (options.attributes.hasOwnProperty(key)) {
                    const attr = options.attributes[key];
                    options.attributes[lodash_1.camelCase(key)] = attr;
                    delete options.attributes[key];
                }
            }
        }
        if (name === 'view') {
            options.name = 'div';
        }
    }
    const isVoidTag = voidHtmlTags.has(options.name);
    let ret = `<${options.name}${stringifyAttributes(options.attributes, name)}${isVoidTag ? `/` : ''}>`;
    if (!isVoidTag) {
        ret += `${options.value}</${options.name}>`;
    }
    return ret;
};
//# sourceMappingURL=create-html-element.js.map