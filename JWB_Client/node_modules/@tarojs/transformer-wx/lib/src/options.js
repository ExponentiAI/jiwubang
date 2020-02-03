"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("./eslint");
const functional_1 = require("./functional");
const env_1 = require("./env");
const class_method_renamer_1 = require("./class-method-renamer");
exports.transformOptions = {};
exports.setTransformOptions = (options) => {
    exports.transformOptions = Object.assign({}, options);
};
exports.buildBabelTransformOptions = () => {
    functional_1.Status.isSFC = false;
    let plugins = [
        require('babel-plugin-transform-do-expressions'),
        require('babel-plugin-transform-export-extensions'),
        require('babel-plugin-transform-flow-strip-types'),
        [require('babel-plugin-transform-define').default, exports.transformOptions.env]
    ];
    if (!exports.transformOptions.isNormal) {
        plugins.push(class_method_renamer_1.buildVistor());
    }
    return {
        filename: exports.transformOptions.sourcePath,
        babelrc: false,
        parserOpts: {
            sourceType: 'module',
            plugins: [
                'classProperties',
                'jsx',
                'flow',
                'flowComment',
                'trailingFunctionCommas',
                'asyncFunctions',
                'exponentiationOperator',
                'asyncGenerators',
                'objectRestSpread',
                'decorators',
                'dynamicImport',
                'doExpressions',
                'exportExtensions'
            ]
        },
        plugins: plugins
            .concat(require('babel-plugin-preval'))
            .concat(process.env.TARO_ENV === 'rn' ? [] : functional_1.functionalComponent)
            .concat(process.env.ESLINT === 'false' || exports.transformOptions.isNormal || exports.transformOptions.isTyped ? [] : eslint_1.eslintValidation)
            .concat((env_1.isTestEnv) ? [] : require('babel-plugin-minify-dead-code').default)
    };
};
//# sourceMappingURL=options.js.map