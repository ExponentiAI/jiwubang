"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("babel-types");
const better_babel_generator_1 = require("better-babel-generator");
const babylon_1 = require("../config/babylon");
const template = require('babel-template');
function convertObjectToAstExpression(obj) {
    const objArr = Object.keys(obj).map(key => {
        const value = obj[key];
        if (typeof value === 'string') {
            return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value));
        }
        if (typeof value === 'number') {
            return t.objectProperty(t.stringLiteral(key), t.numericLiteral(value));
        }
        if (typeof value === 'boolean') {
            return t.objectProperty(t.stringLiteral(key), t.booleanLiteral(value));
        }
        if (Array.isArray(value)) {
            return t.objectProperty(t.stringLiteral(key), t.arrayExpression(convertArrayToAstExpression(value)));
        }
        if (value === null) {
            return t.objectProperty(t.stringLiteral(key), t.nullLiteral());
        }
        if (typeof value === 'object') {
            return t.objectProperty(t.stringLiteral(key), t.objectExpression(convertObjectToAstExpression(value)));
        }
        return t.objectProperty(t.stringLiteral(key), t.nullLiteral());
    });
    return objArr;
}
exports.convertObjectToAstExpression = convertObjectToAstExpression;
// 最低限度的转义： https://github.com/mathiasbynens/jsesc#minimal
function generateMinimalEscapeCode(ast) {
    return better_babel_generator_1.default(ast, {
        jsescOption: {
            minimal: true
        }
    }).code;
}
exports.generateMinimalEscapeCode = generateMinimalEscapeCode;
function convertArrayToAstExpression(arr) {
    return arr.map(value => {
        if (typeof value === 'string') {
            return t.stringLiteral(value);
        }
        if (typeof value === 'number') {
            return t.numericLiteral(value);
        }
        if (typeof value === 'boolean') {
            return t.booleanLiteral(value);
        }
        if (Array.isArray(value)) {
            return convertArrayToAstExpression(value);
        }
        if (typeof value === 'object') {
            return t.objectExpression(convertObjectToAstExpression(value));
        }
        return t.nullLiteral();
    });
}
exports.convertArrayToAstExpression = convertArrayToAstExpression;
function convertSourceStringToAstExpression(str, opts = {}) {
    return template(str, Object.assign({}, babylon_1.default, opts))();
}
exports.convertSourceStringToAstExpression = convertSourceStringToAstExpression;
function convertAstExpressionToVariable(node) {
    if (t.isObjectExpression(node)) {
        const obj = {};
        const properties = node.properties;
        properties.forEach(property => {
            if (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') {
                const key = convertAstExpressionToVariable(property.key);
                const value = convertAstExpressionToVariable(property.value);
                obj[key] = value;
            }
        });
        return obj;
    }
    else if (t.isArrayExpression(node)) {
        return node.elements.map(convertAstExpressionToVariable);
    }
    else if (t.isLiteral(node)) {
        return node['value'];
    }
    else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
        const name = node.name;
        return name === 'undefined'
            ? undefined
            : name;
    }
    else if (t.isJSXExpressionContainer(node)) {
        return convertAstExpressionToVariable(node.expression);
    }
    else {
        return undefined;
    }
}
exports.convertAstExpressionToVariable = convertAstExpressionToVariable;
exports.getObjKey = (node) => {
    if (t.isIdentifier(node)) {
        return node.name;
    }
    else {
        return node.value;
    }
};
