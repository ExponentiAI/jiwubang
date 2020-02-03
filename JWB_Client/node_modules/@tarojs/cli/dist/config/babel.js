"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babelOptions = {
    sourceMap: true,
    presets: [
        'env'
    ],
    plugins: [
        require('babel-plugin-transform-react-jsx'),
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread'
    ]
};
exports.default = babelOptions;
