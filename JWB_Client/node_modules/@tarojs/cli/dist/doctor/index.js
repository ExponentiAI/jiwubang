"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configValidator_1 = require("./configValidator");
const packageValidator_1 = require("./packageValidator");
const recommandValidator_1 = require("./recommandValidator");
const eslintValidator_1 = require("./eslintValidator");
exports.default = {
    validators: [
        configValidator_1.default,
        packageValidator_1.default,
        recommandValidator_1.default,
        eslintValidator_1.default
    ]
};
